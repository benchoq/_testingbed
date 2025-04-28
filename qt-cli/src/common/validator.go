// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package common

import (
	"fmt"
	"path/filepath"
	"qtcli/util"
	"regexp"

	"github.com/go-playground/validator/v10"
)

const (
	TagRequired     = "required"
	TagMatch        = "match"
	TagDirName      = "dirname"
	TagFileName     = "filename"
	TagAbsPath      = "abspath"
	TagProjectName  = "projectname"
	TagCppClassName = "cppclassname"

	// internal tags
	TagAlreadyExists = "alreadyExists"
	TagGeneral       = "general"
)

type ValidationError struct {
	Field   string
	Tag     string
	Message string
}

func (ve ValidationError) Error() string {
	return ve.Message
}

type Validator struct {
	Worker       *validator.Validate
	ErrorBuilder func(
		fieldName string, ve validator.ValidationErrors) []ValidationError
}

func NewValidator() *Validator {
	v := validator.New()
	v.RegisterValidation(TagMatch, validateRegex)
	v.RegisterValidation(TagDirName, validateDirName)
	v.RegisterValidation(TagFileName, validateFileName)
	v.RegisterValidation(TagAbsPath, validateAbsPath)
	v.RegisterValidation(TagProjectName, validateProjectName)
	v.RegisterValidation(TagCppClassName, validateCppClassName)

	return &Validator{
		Worker:       v,
		ErrorBuilder: defaultErrorBuilder,
	}
}

func (v *Validator) Run(
	fieldName, fieldValue, tag string) []ValidationError {
	if e := v.Worker.Var(fieldValue, tag); e != nil {
		if ve, ok := e.(validator.ValidationErrors); ok {
			if v.ErrorBuilder != nil {
				return v.ErrorBuilder(fieldName, ve)
			} else {
				return defaultErrorBuilder(fieldName, ve)
			}
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
func validateRegex(fl validator.FieldLevel) bool {
	return runRegex(fl, fl.Param())
}

func validateFileName(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	return util.IsValidFileName(s)
}

func validateDirName(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	return util.IsValidDirName(s)
}

func validateAbsPath(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	return filepath.IsAbs(s)
}

func validateProjectName(fl validator.FieldLevel) bool {
	return runRegex(fl, "^[a-zA-Z_][a-zA-Z0-9_-]*$")
}

func validateCppClassName(fl validator.FieldLevel) bool {
	return runRegex(
		fl, "^(?:(?:[a-zA-Z_][a-zA-Z_0-9]*::)*[a-zA-Z_][a-zA-Z_0-9]*|)$")
}

func runRegex(fl validator.FieldLevel, pattern string) bool {
	name := fl.Field().String()
	re := regexp.MustCompile(pattern)
	return re.MatchString(name)
}

func defaultErrorBuilder(
	fieldName string, ve validator.ValidationErrors) []ValidationError {
	var all []ValidationError

	for _, ve := range ve {
		msg := ""

		switch ve.Tag() {
		case TagRequired:
			msg = fmt.Sprintf("%s is required", fieldName)
		case TagMatch:
			msg = fmt.Sprintf("%s doesn't match the required pattern", fieldName)
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
