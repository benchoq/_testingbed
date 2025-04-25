// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package server

import (
	"github.com/gin-gonic/gin"
)

type SuccessResponse[T any] struct {
	Success bool `json:"success"`
	Data    T    `json:"data,omitempty"`
}

type ErrorResponse struct {
	Error ErrorContent `json:"error"`
}

type ErrorContent struct {
	Message string        `json:"message"`
	Details []ErrorDetail `json:"details,omitempty"`
}

type ErrorDetail struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func NewErrorResponse(message string, details []ErrorDetail) ErrorResponse {
	return ErrorResponse{
		Error: ErrorContent{
			Message: message,
			Details: details,
		},
	}
}

func ReplyError(c *gin.Context, code int, err error) {
	if err != nil {
		res := ErrorResponse{
			Error: ErrorContent{Message: err.Error()},
		}

		c.JSON(code, res)
	}
}
