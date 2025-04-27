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
	Name       string         `json:"name"`
	WorkingDir string         `json:"workingDir"`
	PresetId   string         `json:"presetId"`
	Options    map[string]any `json:"options"`
}

type ResponseCreateNewItem struct {
	Type       string   `json:"type" binding:"required"`
	Files      []string `json:"files" binding:"required"`
	FilesDir   string   `json:"filesDir" binding:"required"`
	WorkingDir string   `json:"workingDir" binding:"required"`
	DryRun     bool     `json:"dryRun" binding:"required"`
}

func postNewItem(c *gin.Context) {
	var req RequestCreateNewItem
	if err := c.ShouldBindJSON(&req); err != nil {
		ReplyError(c, http.StatusBadRequest, err.Error())
		return
	}

	preset, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
	if err != nil {
		ReplyError(c, http.StatusBadRequest, err.Error())
		return
	}

	preset.MergeOptions(req.Options)
	normalizedWorkingDir := filepath.Clean(req.WorkingDir)
	normalizedWorkingDir = filepath.ToSlash(normalizedWorkingDir)
	dryRun := strings.ToLower(c.Query("dry_run")) == "true"

	result := generator.NewGenerator(req.Name).
		Env(runner.GeneratorEnv).
		WorkingDir(normalizedWorkingDir).
		Preset(preset).
		DryRun(dryRun).
		Render()

	if !result.Success {
		c.JSON(http.StatusBadRequest, NewErrorResponse(result.Error))
		return
	}

	c.JSON(http.StatusCreated, ResponseCreateNewItem{
		Type:       preset.GetTypeName(),
		Files:      result.Data.GetOutputFilesRel(),
		FilesDir:   result.Data.GetOutputDirAbs(),
		WorkingDir: normalizedWorkingDir,
		DryRun:     dryRun,
	})
}
