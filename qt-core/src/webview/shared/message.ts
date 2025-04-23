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

export enum PushId {
  PanelInit,
  ViewClosed,
}

export interface Push<T = unknown> {
  id: PushId;
  data?: T;
}

export enum RequestId {
  ViewSelectWorkingDir,
  // CheckDirectoryExists,
}

export interface Request<T = unknown> {
  id: RequestId;
  tag: string;
  data?: T;
}

export type Reply = Request;
export type Transmission = Push | Request;

export function isPush(transmission: Transmission): transmission is Push {
  return (transmission as Push).id in PushId && !('uniqueId' in transmission);
}

export function isRequest(transmission: Transmission): transmission is Request {
  return (transmission as Request).id in RequestId && 'uniqueId' in transmission;
}
