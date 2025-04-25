// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package common

import (
	"path"
	"path/filepath"
	"qtcli/util"
	"strings"
)

type ValidatorInput struct {
	Name       string
	WorkingDir string
	Preset     Preset
}

type ValidatorOutput struct {
	Success      bool
	ErrorDetails []ErrorDetailEntry
}

func Validate(in ValidatorInput) ValidatorOutput {
	name := strings.TrimSpace(in.Name)
	workingDir := strings.TrimSpace(filepath.Clean(in.WorkingDir))
	workingDir = filepath.ToSlash(workingDir)

	nameErrors := []string{}
	workingDirErrors := []string{}

	// dir error check
	if len(workingDir) == 0 {
		workingDirErrors = append(workingDirErrors, util.Msg("Working directory cannot be empty"))
	}

	if !util.IsAbsPath(workingDir) {
		workingDirErrors = append(workingDirErrors, util.Msg("Working directory must be an absolute path"))
	}

	if !util.IsValidFullPath(workingDir) {
		workingDirErrors = append(workingDirErrors, util.Msg("Invalid working directory name"))
	}

	// dir warning check
	// if !util.EntryExists(workingDirNorm) {
	// 	workingDirWarnings = append(workingDirWarnings, util.Msg("Working directory doesn't exist"))
	// }

	// name error check
	if len(name) == 0 {
		nameErrors = append(nameErrors, util.Msg("Name cannot be empty"))
	}

	if in.Preset.GetTypeId() == TargetTypeProject {
		if !util.IsValidProjectName(name) {
			nameErrors = append(nameErrors, util.Msg("Invalid project name"))
		}

		totalPath := path.Join(workingDir, name)
		if util.EntryExists(totalPath) { // FIXME: bug on checking this
			nameErrors = append(nameErrors, util.Msg("Output folder already exists"))
		}
	} else {
		// TODO: dry-run generator and check if file exists
		if !util.IsValidFileName(name) {
			nameErrors = append(nameErrors, util.Msg("Invalid file name"))
		}
	}

	allErrors := []ErrorDetailEntry{}
	if len(nameErrors) != 0 {
		allErrors = append(allErrors, ErrorDetailEntry{
			Field:   "name",
			Message: strings.Join(nameErrors, "\n"),
		})
	}

	if len(workingDirErrors) != 0 {
		allErrors = append(allErrors, ErrorDetailEntry{
			Field:   "workingDir",
			Message: strings.Join(workingDirErrors, "\n"),
		})
	}

	return ValidatorOutput{
		Success:      len(allErrors) == 0,
		ErrorDetails: allErrors,
	}
}
