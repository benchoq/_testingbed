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

export enum PushId {
  PanelInit,
  ViewClosed,
}

export interface PushData<T = unknown> {
  id: PushId;
  data?: T;
}

export enum CallId {
  ViewSelectWorkingDir,
  // CheckDirectoryExists,
}

export interface CallData<T = unknown> {
  id: CallId;
  tag: string;
  data?: T;
}

export type Reply = CallData;
export type Request = CallData;

export function isPushData(x: unknown): x is PushData {
  return typeof x === 'object' && x !== null &&
         'id' in x && (x as PushData).id in PushId && !('tag' in x);
}

export function isCallData(x: unknown): x is CallData {
  return typeof x === 'object' && x !== null &&
         'id' in x && (x as CallData).id in CallId && 'tag' in x;
}
