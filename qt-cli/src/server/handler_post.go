// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"net/http"
	"path"
	"path/filepath"
	"qtcli/common"
	"qtcli/generator"
	"qtcli/runner"
	"qtcli/util"
	"strings"

	"github.com/gin-gonic/gin"
)

type RequestCreateNewItem struct {
	Name       string         `json:"name" binding:"required"`
	WorkingDir string         `json:"workingDir" binding:"required"`
	PresetId   string         `json:"presetId" binding:"required"`
	Options    map[string]any `json:"options"`
}

type ResponseCreateNewItem struct {
	Type       string         `json:"type" binding:"required"`
	Files      []string       `json:"files" binding:"required"`
	FilesDir   string         `json:"filesDir" binding:"required"`
	WorkingDir string         `json:"workingDir" binding:"required"`
	Message    string         `json:"message" binding:"required"`
	Debug      map[string]any `json:"_debug"`
}

type RequestValidateNewItem struct {
	Name       string `json:"name"`
	WorkingDir string `json:"workingDir"`
	PresetId   string `json:"presetId" binding:"required"`
}

func postNewItemValidation(c *gin.Context) {
	var req RequestValidateNewItem

	if err := c.ShouldBindJSON(&req); err != nil {
		ReplyFromError(c, http.StatusBadRequest, err)
		return
	}

	preset, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
	if err != nil {
		ReplyFromError(c, http.StatusBadRequest, err)
		return
	}

	nameErrors := []string{}
	workingDirErrors := []string{}
	workingDirWarnings := []string{}

	nameNorm := strings.TrimSpace(req.Name)
	workingDirNorm := strings.TrimSpace(filepath.Clean(req.WorkingDir))
	workingDirNorm = filepath.ToSlash(workingDirNorm)

	// dir error check
	if len(workingDirNorm) == 0 {
		workingDirErrors = append(workingDirErrors, util.Msg("Working directory cannot be empty"))
	}

	if !util.IsAbsPath(workingDirNorm) {
		workingDirErrors = append(workingDirErrors, util.Msg("Working directory must be an absolute path"))
	}

	if !util.IsValidFullPath(workingDirNorm) {
		workingDirErrors = append(workingDirErrors, util.Msg("Invalid working directory name"))
	}

	// dir warning check
	if !util.EntryExists(workingDirNorm) {
		workingDirWarnings = append(workingDirWarnings, util.Msg("Working directory doesn't exist"))
	}

	// name error check
	if len(nameNorm) == 0 {
		nameErrors = append(nameErrors, util.Msg("Name cannot be empty"))
	}

	if preset.GetTypeId() == common.TargetTypeProject {
		if !util.IsValidProjectName(nameNorm) {
			nameErrors = append(nameErrors, util.Msg("Invalid project name"))
		}

		totalPath := path.Join(workingDirNorm, nameNorm)
		if util.EntryExists(totalPath) { // FIXME: bug on checking this
			nameErrors = append(nameErrors, util.Msg("Output folder already exists"))
		}
	} else {
		// TODO: dry-run generator and check if file exists
		if !util.IsValidFileName(nameNorm) {
			nameErrors = append(nameErrors, util.Msg("Invalid file name"))
		}
	}

	if (len(nameErrors) == 0) && (len(workingDirErrors) == 0) {
		c.JSON(http.StatusOK, SuccessResponse[any]{Success: true})
		return
	} else {
		// TODO: check status code
		c.JSON(http.StatusOK, ErrorResponse{
			Error: ErrorContent{
				Message: "Input validation failed",
				Details: []ErrorDetail{
					{Field: "name", Message: strings.Join(nameErrors, "\n")},
					{Field: "workingDir", Message: strings.Join(workingDirErrors, "\n")},
				},
			},
		})
	}
}

func postNewItem(c *gin.Context) {
	var req RequestCreateNewItem
	if err := c.ShouldBindJSON(&req); err != nil {
		ReplyFromError(c, http.StatusBadRequest, err)
		return
	}

	preset, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
	if err != nil {
		ReplyFromError(c, http.StatusBadRequest, err)
		return
	}

	dryRun := strings.ToLower(c.Query("dry_run")) == "true"

	preset.MergeOptions(req.Options)
	normalizedWorkingDir := filepath.Clean(req.WorkingDir)
	normalizedWorkingDir = filepath.ToSlash(normalizedWorkingDir)

	output, err := generator.NewGenerator(req.Name).
		Env(runner.GeneratorEnv).
		WorkingDir(normalizedWorkingDir).
		Preset(preset).
		DryRun(dryRun).
		Render()

	if err != nil {
		ReplyFromError(c, http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusCreated, ResponseCreateNewItem{
		Type:       preset.GetTypeName(),
		Files:      output.GetOutputFilesRel(),
		FilesDir:   output.GetOutputDirAbs(),
		WorkingDir: normalizedWorkingDir,
		Message:    "Item created successfully",
		Debug: map[string]any{
			"preset": map[string]any{
				"name":        preset.Name,
				"templateDir": preset.TemplateDir,
				"options":     preset.Options,
			},
			"request": req,
		},
	})
}
