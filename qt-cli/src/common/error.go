// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package common

type ErrorWithDetails struct {
	Message string        `json:"message"`
	Details []ErrorDetail `json:"details,omitempty"`
}

func (e ErrorWithDetails) Error() string {
	return e.Message
}

type ErrorDetail struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}
