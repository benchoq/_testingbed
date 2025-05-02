// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package generator

import (
	"os"
	"path/filepath"
	"qtcli/common"
	"qtcli/util"
	"strings"
)

const (
	FieldName       = "Name"
	FieldWorkingDir = "WorkingDir"
)

var ProjectNameTags = strings.Join([]string{
	common.TagRequired,
	common.TagDirName,
	common.TagProjectName,
}, ",")

var FileNameTags = strings.Join([]string{
	common.TagRequired,
	common.TagFileName,
}, ",")

var WorkingDirTags = strings.Join([]string{
	common.TagRequired,
	common.TagAbsPath,
}, ",")

// in
type ValidatorIn struct {
	Name       string
	WorkingDir string
	Preset     common.Preset
}

// out
type ValidatorOut struct {
	Errors   *common.ErrorWithDetails
	Warnings []string
}

func (o *ValidatorOut) hasError() bool {
	return o.Errors != nil
}

func Validate(in ValidatorIn) ValidatorOut {
	isProject := in.Preset.GetTypeId() == common.TargetTypeProject
	var nameTags string = FileNameTags
	if isProject {
		nameTags = ProjectNameTags
	}

	v := common.NewValidationHelper()
	errorDetails := append(
		v.RunVar(FieldName, in.Name, nameTags),
		v.RunVar(FieldWorkingDir, in.WorkingDir, WorkingDirTags)...,
	)

	if len(errorDetails) > 0 {
		return ValidatorOut{
			Errors: &common.ErrorWithDetails{
				Message: "Input validation failed",
				Details: errorDetails,
			}}
	}

	if isProject {
		targetPath := filepath.Join(in.WorkingDir, in.Name)
		if _, err := os.Stat(targetPath); err == nil {
			errorDetails = append(errorDetails, common.ErrorDetail{
				Field:   FieldName,
				Message: "target folder already exists: " + targetPath,
			})

			return ValidatorOut{
				Errors: &common.ErrorWithDetails{
					Message: "Input validation failed",
					Details: errorDetails,
				}}
		}
	}

	// warning if working directory doesn't exist
	if !util.DirExists(in.WorkingDir) {
		warnings := []string{
			"working directory doesn't exist: " + in.WorkingDir,
		}

		return ValidatorOut{Warnings: warnings}
	}

	return ValidatorOut{}
}
