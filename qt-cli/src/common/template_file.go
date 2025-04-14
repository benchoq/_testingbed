// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package common

import (
	"errors"
	"fmt"
	"io/fs"
	"path"
	"qtcli/util"

	"github.com/sirupsen/logrus"
	"gopkg.in/yaml.v3"
)

type TemplateFile struct {
	fs       fs.FS
	filePath string
	contents TemplateFileContents
}

type TemplateFileContents struct {
	Version  string              `yaml:"version"`
	TypeName string              `yaml:"type"`
	Files    []TemplateItem      `yaml:"files"`
	Fields   []util.StringAnyMap `yaml:"fields"`
}

type TemplateItem struct {
	In     string `yaml:"in"`
	Out    string `yaml:"out"`
	When   string `yaml:"when"`
	Bypass bool   `yaml:"bypass"`
}

func NewTemplateFileFS(fs fs.FS, filePath string) *TemplateFile {
	return &TemplateFile{
		fs:       fs,
		filePath: filePath,
	}
}

func OpenTemplateFileFromPreset(fs fs.FS, preset Preset) (*TemplateFile, error) {
	dir := preset.GetTemplateDir()
	filePath := path.Join(dir, TemplateFileName)

	if len(dir) == 0 {
		return nil, errors.New(util.Msg("cannot determine a config file path"))
	}

	if !util.EntryExistsFS(fs, filePath) {
		return nil,
			fmt.Errorf(
				util.Msg("template definition does not exist, dir = '%v'"), dir)
	}

	template := NewTemplateFileFS(fs, filePath)
	err := template.Open()
	if err != nil {
		return nil, err
	}

	return template, nil
}

func (f *TemplateFile) Open() error {
	logrus.Debug(fmt.Sprintf(
		"reading template definition, file = '%v'", f.filePath))

	raw, err := util.ReadAllFromFS(f.fs, f.filePath)
	if err != nil {
		return err
	}

	err = yaml.Unmarshal(raw, &f.contents)
	if err != nil {
		return err
	}

	return nil
}

func (f *TemplateFile) GetTypeName() string {
	return f.contents.TypeName
}

func (f *TemplateFile) GetTargetType() TargetType {
	return TargetTypeFromString(f.contents.TypeName)
}

func (f *TemplateFile) GetFileItems() []TemplateItem {
	return f.contents.Files
}

func (f *TemplateFile) GetFields() []util.StringAnyMap {
	return f.contents.Fields
}
