// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package common

import (
	"fmt"
	"os"
	"path/filepath"
	"qtcli/util"
	"regexp"

	"github.com/go-playground/validator/v10"
)

const (
	TagRequired     = "required"
	TagDirName      = "dirname"
	TagFileName     = "filename"
	TagAbsPath      = "abspath"
	TagProjectName  = "projectname"
	TagCppClassName = "cppclassname"

	// internal tags
	TagAlreadyExists = "alreadyExists"
	TagGeneral       = "general"
)

const (
	FieldName       = "Name"
	FieldWorkingDir = "WorkingDir"
)

// separate handling for a project vs others
type ValidatorInput struct {
	Name       string
	WorkingDir string
	Preset     Preset
}

type ValidatorOutput struct {
	Errors   []ValidationError
	Warnings []string
}

type ValidationError struct {
	Field   string
	Tag     string
	Message string
}

type Validator struct {
	worker *validator.Validate
}

func NewValidator() *Validator {
	v := validator.New()
	v.RegisterValidation(TagDirName, ValidateDirName)
	v.RegisterValidation(TagFileName, ValidateFileName)
	v.RegisterValidation(TagAbsPath, ValidateAbsPath)
	v.RegisterValidation(TagProjectName, ValidateProjectName)
	v.RegisterValidation(TagCppClassName, ValidateCppClassName)

	return &Validator{
		worker: v,
	}
}

func (v *Validator) Run(in ValidatorInput) ValidatorOutput {
	// validate
	errors := append(
		v.RunField(FieldName, in.Name, "required,dirname,projectname"),
		v.RunField(FieldWorkingDir, in.WorkingDir, "required,abspath")...,
	)

	if len(errors) > 0 {
		return ValidatorOutput{Errors: errors}
	}

	// check if the target path already exists
	targetPath := filepath.Join(in.WorkingDir, in.Name)
	if _, err := os.Stat(targetPath); err == nil {
		errors = append(errors, ValidationError{
			Field:   FieldName,
			Tag:     TagAlreadyExists,
			Message: "target folder already exists: " + targetPath,
		})

		return ValidatorOutput{Errors: errors}
	}

	// warning if working directory doesn't exist
	if !util.DirExists(in.WorkingDir) {
		warnings := []string{
			"working directory doesn't exist: " + in.WorkingDir,
		}

		return ValidatorOutput{Warnings: warnings}
	}

	return ValidatorOutput{}
}

func (v *Validator) RunField(
	fieldName, fieldValue, tag string) []ValidationError {
	if e := v.worker.Var(fieldValue, tag); e != nil {
		if ve, ok := e.(validator.ValidationErrors); ok {
			return translateErrors(fieldName, ve)
		}

		return []ValidationError{{
			Field:   fieldName,
			Tag:     TagGeneral,
			Message: e.Error(),
		}}
	}

	return nil
}

// validation helpers
func translateErrors(
	fieldName string, ve validator.ValidationErrors) []ValidationError {
	var all []ValidationError

	for _, ve := range ve {
		msg := ""

		switch ve.Tag() {
		case TagRequired:
			msg = fmt.Sprintf("%s is required", fieldName)
		case TagDirName:
			msg = fmt.Sprintf("%s must be a valid directory name", fieldName)
		case TagFileName:
			msg = fmt.Sprintf("%s must be a valid file name", fieldName)
		case TagAbsPath:
			msg = fmt.Sprintf("%s must be an absolute path", fieldName)
		case TagProjectName:
			msg = fmt.Sprintf("%s must be a valid project name", fieldName)
		case TagCppClassName:
			msg = fmt.Sprintf("%s must be a valid C++ class name", fieldName)
		default:
			msg = fmt.Sprintf("%s is invalid (%s)", fieldName, ve.Tag())
		}

		all = append(all, ValidationError{
			Field:   fieldName,
			Tag:     ve.Tag(),
			Message: msg,
		})
	}

	return all
}

// validation functions
func ValidateFileName(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	return util.IsValidFileName(s)
}

func ValidateDirName(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	return util.IsValidDirName(s)
}

func ValidateAbsPath(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	return filepath.IsAbs(s)
}

func ValidateProjectName(fl validator.FieldLevel) bool {
	return ValidateRegex(fl, "^[a-zA-Z_][a-zA-Z0-9_-]*$")
}

func ValidateCppClassName(fl validator.FieldLevel) bool {
	return ValidateRegex(
		fl, "^(?:(?:[a-zA-Z_][a-zA-Z_0-9]*::)*[a-zA-Z_][a-zA-Z_0-9]*|)$")
}

func ValidateRegex(fl validator.FieldLevel, pattern string) bool {
	name := fl.Field().String()
	re := regexp.MustCompile(pattern)
	return re.MatchString(name)
}
