// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package common

import "strings"

type TargetType int

const (
	TargetTypeUnknown TargetType = iota
	TargetTypeFile
	TargetTypeProject
)

func TargetTypeFromString(s string) TargetType {
	v := strings.TrimSpace(strings.ToLower(s))

	switch v {
	case "file":
		return TargetTypeFile
	case "project":
		return TargetTypeProject
	default:
		return TargetTypeUnknown
	}
}

func TargetTypeToString(t TargetType) string {
	switch t {
	case TargetTypeFile:
		return "file"
	case TargetTypeProject:
		return "project"
	default:
		return ""
	}
}
