// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"qtcli/common"

	"github.com/gin-gonic/gin"
)

type SuccessResponse[T any] struct {
	Success bool `json:"success"`
	Data    T    `json:"data,omitempty"`
}

type ErrorResponse struct {
	Error common.ErrorWithDetails `json:"error"`
}

func NewErrorResponse(message string, details []common.ErrorDetailEntry) ErrorResponse {
	return ErrorResponse{
		Error: common.ErrorWithDetails{
			Message: message,
			Details: details,
		},
	}
}

func ReplyError(c *gin.Context, code int, err error) {
	if err != nil {
		res := ErrorResponse{
			Error: common.ErrorWithDetails{Message: err.Error()},
		}

		c.JSON(code, res)
	}
}
