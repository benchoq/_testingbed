// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package handlers

import (
	"qtcli/common"
	"qtcli/runner"
	"qtcli/util"

	"github.com/gin-gonic/gin"
)

type PatchCustomPresetRequest struct {
	Options map[string]any `json:"options"`
}

func PatchCustomPresetById(c *gin.Context) {
	var req PatchCustomPresetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ReplyErrorMsg(c, err.Error())
		return
	}

	id := c.Param("id")
	preset, err := runner.Presets.User.FindByUniqueId(id)
	if err != nil {
		ReplyErrorMsg(c, err.Error())
		return
	}

	preset.Options = util.Merge(preset.GetOptions(), req.Options)

	f := runner.Presets.User.GetFile()
	f.Replace(preset)
	f.Save()

	ReplyPost(c, StatusAndIdResponse{
		Status: common.ServerStatusUpdated,
		Id:     preset.GetUniqueId(),
	})
}

// func PatchCustomPresetById(c *gin.Context) {
// 	context := PreparePostItemsContext(c)
// 	if context == nil {
// 		return
// 	}
// }

// 	result := generator.NewGenerator(context.name).
// 		Env(runner.GeneratorEnv).
// 		WorkingDir(context.workingDir).
// 		Preset(context.preset).
// 		DryRun(context.dryRun).
// 		Render()

// 	if !result.Success {
// 		ReplyError(c, result.Error.Message, &result.Error.Details)
// 		return
// 	}

// 	ReplyPost(c, NewItemResponse{
// 		Type:       context.preset.GetTypeName(),
// 		Files:      result.Data.GetOutputFilesRel(),
// 		FilesDir:   result.Data.GetOutputDirAbs(),
// 		WorkingDir: context.workingDir,
// 		DryRun:     context.dryRun,
// 	})
// }

// func PostItemsValidate(c *gin.Context) {
// 	context := PreparePostItemsContext(c)
// 	if context == nil {
// 		return
// 	}

// 	issues := generator.Validate(generator.ValidatorIn{
// 		Name:       context.name,
// 		WorkingDir: context.workingDir,
// 		TypeId:     context.preset.GetTypeId(),
// 	})

// 	if len(issues) != 0 {
// 		ReplyError(c, common.InputHasIssues, &issues)
// 		return
// 	}

// 	ReplyStatus(c, common.InputOkay)
// }

// func PostCustomPreset(c *gin.Context) {
// 	var req NewCustomPresetRequest
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		ReplyErrorMsg(c, err.Error())
// 		return
// 	}

// 	src, err := runner.Presets.Any.FindByUniqueId(req.PresetId)
// 	if err != nil {
// 		ReplyErrorMsg(c, err.Error())
// 		return
// 	}

// 	_, err = runner.Presets.User.FindByName(req.Name)
// 	if err == nil {
// 		ReplyErrorMsg(c, common.ServerPresetAlreadyExists)
// 		return
// 	}

// 	// TODO: validate name - ensure not starting with '@', not special chars...
// 	newPreset := common.NewPresetData(
// 		req.Name,
// 		src.GetTemplateDir(),
// 		util.Merge(src.GetOptions(), req.Options),
// 	)

// 	f := runner.Presets.User.GetFile()
// 	f.Add(newPreset)
// 	f.Save()

// 	ReplyPost(c, StatusAndIdResponse{
// 		Status: common.ServerStatusCreated,
// 		Id:     newPreset.GetUniqueId(),
// 	})
// }
