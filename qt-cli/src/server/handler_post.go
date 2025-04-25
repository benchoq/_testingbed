// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"net/http"
	"path/filepath"
	"qtcli/generator"
	"qtcli/runner"
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
	Type       string   `json:"type" binding:"required"`
	Files      []string `json:"files" binding:"required"`
	FilesDir   string   `json:"filesDir" binding:"required"`
	WorkingDir string   `json:"workingDir" binding:"required"`
	Message    string   `json:"message" binding:"required"`
	DryRun     bool     `json:"dryRun" binding:"required"`
}

type RequestValidateNewItem struct {
	Name       string `json:"name"`
	WorkingDir string `json:"workingDir"`
	PresetId   string `json:"presetId" binding:"required"`
}

func postNewItemValidation(c *gin.Context) {
	var req RequestValidateNewItem

	if err := c.ShouldBindJSON(&req); err != nil {
		ReplyError(c, http.StatusBadRequest, err)
		return
	}

	preset, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
	if err != nil {
		ReplyError(c, http.StatusBadRequest, err)
		return
	}

	// nameErrors := []string{}
	// workingDirErrors := []string{}
	// workingDirWarnings := []string{}

	// nameNorm := strings.TrimSpace(req.Name)
	// workingDirNorm := strings.TrimSpace(filepath.Clean(req.WorkingDir))
	// workingDirNorm = filepath.ToSlash(workingDirNorm)

	in := ValidatorInput{
		Name:       req.Name,
		WorkingDir: req.WorkingDir,
		Preset:     preset,
	}

	out := Validate(in)
	if out.Success {
		c.JSON(http.StatusOK, SuccessResponse[any]{Success: true})
		return
	}

	errorDetails := []ErrorDetail{}
	for _, detail := range out.Details {
		errorDetails = append(errorDetails, ErrorDetail{
			Field:   detail.Field,
			Message: strings.Join(detail.Messages, "\n"),
		})
	}

	c.JSON(
		http.StatusOK, // TODO: check status code
		NewErrorResponse("Input validation failed", errorDetails),
	)
}

func postNewItem(c *gin.Context) {
	var req RequestCreateNewItem
	if err := c.ShouldBindJSON(&req); err != nil {
		ReplyError(c, http.StatusBadRequest, err)
		return
	}

	preset, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
	if err != nil {
		ReplyError(c, http.StatusBadRequest, err)
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
		ReplyError(c, http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusCreated, ResponseCreateNewItem{
		Type:       preset.GetTypeName(),
		Files:      output.GetOutputFilesRel(),
		FilesDir:   output.GetOutputDirAbs(),
		WorkingDir: normalizedWorkingDir,
		Message:    "Item created successfully",
		DryRun:     dryRun,
	})
}
