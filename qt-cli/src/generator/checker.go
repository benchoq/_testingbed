// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package generator

import (
	"fmt"
	"os"
	"path/filepath"
	"qtcli/common"
	"qtcli/util"

	"github.com/go-playground/validator/v10"
)

const (
	FieldName       = "Name"
	FieldWorkingDir = "WorkingDir"
)

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
	v.ErrorBuilder = translateErrors

	errors := append(
		v.Run(FieldName, in.Name, "required,dirname,projectname"),
		v.Run(FieldWorkingDir, in.WorkingDir, "required,abspath")...,
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

func translateErrors(
	fieldName string, ve validator.ValidationErrors) []common.ValidationError {
	var all []common.ValidationError

	for _, ve := range ve {
		msg := ""

		switch ve.Tag() {
		case common.TagRequired:
			msg = fmt.Sprintf("%s is required", fieldName)
		case common.TagMatch:
			msg = fmt.Sprintf("%s doesn't match the required pattern", fieldName)
		case common.TagDirName:
			msg = fmt.Sprintf("%s must be a valid directory name", fieldName)
		case common.TagFileName:
			msg = fmt.Sprintf("%s must be a valid file name", fieldName)
		case common.TagAbsPath:
			msg = fmt.Sprintf("%s must be an absolute path", fieldName)
		case common.TagProjectName:
			msg = fmt.Sprintf("%s must be a valid project name", fieldName)
		case common.TagCppClassName:
			msg = fmt.Sprintf("%s must be a valid C++ class name", fieldName)
		default:
			msg = fmt.Sprintf("%s is invalid (%s)", fieldName, ve.Tag())
		}

		all = append(all, common.ValidationError{
			Field:   fieldName,
			Tag:     ve.Tag(),
			Message: msg,
		})
	}

	return all
}
