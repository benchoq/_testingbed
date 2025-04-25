// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"path"
	"path/filepath"
	"qtcli/common"
	"qtcli/util"
	"strings"
)

// in
type ValidatorInput struct {
	Name       string
	WorkingDir string
	Preset     common.PresetData
}

// out
type ValidatorOutput struct {
	Success bool
	Details []ValidatorOutputDetail
}

// output entry
type ValidatorOutputDetail struct {
	Field    string
	Messages []string
}

func NewValidatorDetail(field string) *ValidatorOutputDetail {
	return &ValidatorOutputDetail{
		Field:    field,
		Messages: []string{},
	}
}

func (v *ValidatorOutputDetail) AddMessage(m string) *ValidatorOutputDetail {
	v.Messages = append(v.Messages, m)
	return v
}

func Validate(in ValidatorInput) ValidatorOutput {
	name := strings.TrimSpace(in.Name)
	workingDir := strings.TrimSpace(filepath.Clean(in.WorkingDir))
	workingDir = filepath.ToSlash(workingDir)

	nameDetail := NewValidatorDetail("name")
	workingDirDetail := NewValidatorDetail("workingDir")

	// dir error check
	if len(workingDir) == 0 {
		workingDirDetail.AddMessage(util.Msg("Working directory cannot be empty"))
	}

	if !util.IsAbsPath(workingDir) {
		workingDirDetail.AddMessage(util.Msg("Working directory must be an absolute path"))
	}

	if !util.IsValidFullPath(workingDir) {
		workingDirDetail.AddMessage(util.Msg("Invalid working directory name"))
	}

	// dir warning check
	// if !util.EntryExists(workingDirNorm) {
	// 	workingDirWarnings = append(workingDirWarnings, util.Msg("Working directory doesn't exist"))
	// }

	// name error check
	if len(name) == 0 {
		nameDetail.AddMessage(util.Msg("Name cannot be empty"))
	}

	if in.Preset.GetTypeId() == common.TargetTypeProject {
		if !util.IsValidProjectName(name) {
			nameDetail.AddMessage(util.Msg("Invalid project name"))
		}

		totalPath := path.Join(workingDir, name)
		if util.EntryExists(totalPath) { // FIXME: bug on checking this
			nameDetail.AddMessage(util.Msg("Output folder already exists"))
		}
	} else {
		// TODO: dry-run generator and check if file exists
		if !util.IsValidFileName(name) {
			nameDetail.AddMessage(util.Msg("Invalid file name"))
		}
	}

	allDetails := []ValidatorOutputDetail{}
	if len(nameDetail.Messages) != 0 {
		allDetails = append(allDetails, *nameDetail)
	}

	if len(workingDirDetail.Messages) != 0 {
		allDetails = append(allDetails, *workingDirDetail)
	}

	return ValidatorOutput{
		Success: len(allDetails) == 0,
		Details: allDetails,
	}
}
