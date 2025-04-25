// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package util

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsValidFullPath(t *testing.T) {
	dataSet := []struct {
		path   string
		result bool
	}{
		{"", false},
		{"COM1", false},
		{"COM10", true},
		{"invalid:name", false},
		{"/tmp/test", true},
		{"C:\\Users", true},
	}
	// 'C:\Users' => valid? true
	// 'D:\NotExists' => valid? false
	// 'COM1' => valid? false
	// 'COM10' => valid? true
	// 'valid_folder' => valid? true
	// 'invalid:name' => valid? false
	// '/tmp/test' => valid? true
	// 'my/folder' => valid? false
	// '.hidden' => valid? true
	// ' ' => valid? false

	for _, data := range dataSet {
		name := fmt.Sprintf("'%s'", data.path)
		t.Run(name, func(t *testing.T) {
			assert.Equal(t, data.result, IsValidFullPath(data.path))
		})
	}
}
