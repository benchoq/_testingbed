// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"net/http"
	"path/filepath"
	"qtcli/generator"
	"qtcli/runner"

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

func postNewItem(c *gin.Context) {
	var req RequestCreateNewItem

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	preset, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	preset.MergeOptions(req.Options)
	normalizedWorkingDir := filepath.Clean(req.WorkingDir)
	normalizedWorkingDir = filepath.ToSlash(normalizedWorkingDir)

	output, err := generator.NewGenerator(req.Name).
		Env(runner.GeneratorEnv).
		WorkingDir(normalizedWorkingDir).
		Preset(preset).
		Render()

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
