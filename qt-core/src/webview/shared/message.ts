// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export enum MessageId {
  // panel --> webview
  Initialize,

  // panel <-- webview 
  RequestSelectFolder,
  RequestCheckDirectoryExists,

  ItemCreated,
  WizardClosed,
  SaveWorkingDirChanged,
}

export interface Message<T = unknown> {
  messageId: MessageId;
  requestId?: string;
  payload?: T;
}
