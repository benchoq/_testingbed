// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

package handlers

import (
	"os"
	"qtcli/common"
	"qtcli/runner"
	"qtcli/util"
	"time"

	"github.com/gin-gonic/gin"
)

func DeleteServer(c *gin.Context) {
	ReplyStatus(c, common.ServerClosing)

	go func() {
		time.Sleep(1 * time.Second)
		util.SendSigTermOrKill(os.Getpid())
	}()
}

func DeleteCustomPreset(c *gin.Context) {
	id := c.Param("id")
	p, err := runner.Presets.User.FindByUniqueId(id)
	if err != nil {
		ReplyErrorMsg(c, common.ServerNoPreset)
		return
	}

	f := runner.Presets.User.GetFile()
	f.Remove(p.Name)
	f.Save()

	ReplyDelete(c, p.GetUniqueId())
}
