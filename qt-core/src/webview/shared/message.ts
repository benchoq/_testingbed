// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

// export enum MessageId {
//   // panel --> webview
//   Initialize,

//   // panel <-- webview 
//   RequestSelectFolder,
//   RequestCheckDirectoryExists,

//   ItemCreated,
//   WizardClosed,
//   SaveWorkingDirChanged,
// }

// export interface Message<T = unknown> {
//   messageId: MessageId;
//   requestId?: string;
//   payload?: T;
// }

// export enum MessageCategory {
//   Push,
//   Request,
//   Reply
// }

// export enum MessageId {
//   PanelInit,
//   ViewClosed,
//   ViewSelectWorkingDir,
// }

// export interface Message<T = unknown> {
//   category: MessageCategory,
//   id: MessageId,
//   tag?: string;
//   data?: T,
// }

export enum PushMessageId {
  PanelInit,
  ViewClosed,
}

export interface PushMessage<T = unknown> {
  id: PushMessageId;
  data?: T;
}

export enum CallMessageId {
  ViewSelectWorkingDir,
  ViewCallQtcli,
  // CheckDirectoryExists,
}

export interface CallMessage<T = unknown> {
  id: CallMessageId;
  tag: string;
  data?: T;
}

export function isPushMessage(x: unknown): x is PushMessage {
  return typeof x === 'object' && x !== null &&
         'id' in x && (x as PushMessage).id in PushMessageId && !('tag' in x);
}

export function isCallMessage(x: unknown): x is CallMessage {
  return typeof x === 'object' && x !== null &&
         'id' in x && (x as CallMessage).id in CallMessageId && 'tag' in x;
}
