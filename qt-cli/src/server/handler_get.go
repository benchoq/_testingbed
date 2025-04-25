// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"encoding/json"
	"net/http"
	"path"
	"qtcli/common"
	"qtcli/runner"
	"qtcli/util"

	"github.com/gin-gonic/gin"
)

type ResponsePreset struct {
	Id   string              `json:"id"`
	Name string              `json:"name"`
	Meta common.TemplateMeta `json:"meta"`
}

type ResponsePresetPrompt struct {
	Id     string            `json:"id"`
	Prompt util.StringAnyMap `json:"prompt"`
}

func getPresets(c *gin.Context) {
	var presets []common.PresetData
	type_s := c.DefaultQuery("type", "")

	if len(type_s) == 0 {
		presets = runner.Presets.Any.GetAll()
	} else {
		type_enum := common.TargetTypeFromString(type_s)
		presets = runner.Presets.Any.FindByType(type_enum)
	}

	replyPresets(c, presets)
}

func getPresetById(c *gin.Context) {
	id := c.Param("id")
	list := []common.PresetData{}

	p, err := runner.Presets.Any.FindByUniqueId(id)
	if err == nil {
		list = append(list, p)
	}

	replyPresets(c, list)
}

func getPresetPromptById(c *gin.Context) {
	id := c.Param("id")
	// list := []common.PresetData{}

	p, err := runner.Presets.Any.FindByUniqueId(id)
	if err != nil {
		ReplyError(c, http.StatusBadRequest, err.Error())
		return
	}

	prompt, _ := getPromptDefinesFrom(p.GetTemplateDir())

	c.JSON(http.StatusOK, ResponsePresetPrompt{
		Id:     p.GetUniqueId(),
		Prompt: prompt,
	})
}

func getPromptDefinesFrom(dir string) (map[string]interface{}, error) {
	fullPath := path.Join(dir, common.PromptFileName)

	// note,
	// the absence of prompt definition isn't considered as an error
	// it means there is nothing to ask to the user.
	if !util.EntryExistsFS(runner.GeneratorEnv.FS, fullPath) {
		return map[string]interface{}{}, nil
	}

	promptFile := common.NewPromptFileFS(runner.GeneratorEnv.FS, fullPath)
	if err := promptFile.Open(); err != nil {
		return map[string]interface{}{}, err
	}

	jsonString, err := promptFile.ToJsonString()
	if err != nil {
		return map[string]interface{}{}, err
	}

	var result map[string]interface{}
	err = json.Unmarshal([]byte(jsonString), &result)
	if err != nil {
		return map[string]interface{}{}, err
	}

	return result, nil
}

// helpers
func replyPresets(c *gin.Context, presets []common.PresetData) {
	if len(presets) == 0 {
		ReplyError(c, http.StatusBadRequest, "could not find any preset")
		return
	}

	res := []ResponsePreset{}

	for _, p := range presets {
		// TODO: add error handling here
		template, _ := common.OpenTemplateFileFromPreset(runner.GeneratorEnv.FS, p)

		res = append(res, ResponsePreset{
			Id:   p.GetUniqueId(),
			Name: p.GetName(),
			Meta: template.GetMeta(),
		})
	}

	c.JSON(http.StatusOK, res)
}
