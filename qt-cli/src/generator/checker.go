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

var NameTags = strings.Join([]string{
	common.TagRequired, common.TagDirName, common.TagProjectName}, ",")
var WorkingDirTags = strings.Join([]string{
	common.TagRequired, common.TagAbsPath}, ",")

// in
type CheckerIn struct {
	Name       string
	WorkingDir string
	Preset     common.Preset
}

// out
type CheckerOut struct {
	Errors   []common.ValidationError
	Warnings []string
}

func (vo *CheckerOut) IsSuccess() bool {
	return len(vo.Errors) == 0
}

func (vo *CheckerOut) ConvertToError(msg string) common.ErrorWithDetails {
	if vo.IsSuccess() {
		return common.ErrorWithDetails{}
	}

	details := []common.ErrorDetail{}
	for _, e := range vo.Errors {
		details = append(details, common.ErrorDetail{
			Field:   e.Field,
			Message: e.Message,
		})
	}

	return common.ErrorWithDetails{
		Message: msg,
		Details: details,
	}
}

func Check(in CheckerIn) CheckerOut {
	v := common.NewValidator()
	errors := append(
		v.Run(FieldName, in.Name, NameTags),
		v.Run(FieldWorkingDir, in.WorkingDir, WorkingDirTags)...,
	)

	if len(errors) > 0 {
		return CheckerOut{Errors: errors}
	}

	// check if the target path already exists
	targetPath := filepath.Join(in.WorkingDir, in.Name)
	if _, err := os.Stat(targetPath); err == nil {
		errors = append(errors, common.ValidationError{
			Field:   FieldName,
			Tag:     common.TagAlreadyExists,
			Message: "target folder already exists: " + targetPath,
		})

		return CheckerOut{Errors: errors}
	}

	// warning if working directory doesn't exist
	if !util.DirExists(in.WorkingDir) {
		warnings := []string{
			"working directory doesn't exist: " + in.WorkingDir,
		}

		return CheckerOut{Warnings: warnings}
	}

	return CheckerOut{}
}
