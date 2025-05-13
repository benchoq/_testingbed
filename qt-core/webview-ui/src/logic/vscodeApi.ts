// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import type { WebviewApi } from "vscode-webview";

import { 
  type PushMessage, PushMessageId, 
  type CallMessage, CallMessageId, isPushMessage, isCallMessage
} from '@shared/message';

class VSCodeApiWrapper {
  private readonly _api: WebviewApi<unknown> | undefined;
  private _pendingCalls = new Map<string, (value: any) => void>();
  private _onDidReceivePushMessage = (p: PushMessage) => {};

  constructor() {
    if (typeof acquireVsCodeApi === "function") {
      this._api = acquireVsCodeApi();
    }
  
    window.addEventListener("message", (e: MessageEvent) => {
      if (!e.origin.startsWith("vscode-webview://")) {
        console.log(`received message, but the origin is not expected: ${e.origin}`)
        return;
      }

      const data = e.data;

      if (isPushMessage(data)) {
        this._onDidReceivePushMessage(data as PushMessage);
      } else if (isCallMessage(data)) {
        this._onDidReceiveCallMessage(data as CallMessage);
      } else {
        console.warn("Unknown message");
      }
    });
  }

  public onDidReceivePushMessage(handler: (p: PushMessage) => void) {
    this._onDidReceivePushMessage = handler
  }

  public isValid(): boolean {
    return (this._api !== undefined);
  }

  public push(id: PushMessageId, data?: unknown) {
    if (!this._api) {
      console.log("api is invalid");
      return;
    }
    
    const p: PushMessage = { id, data };
    this._api.postMessage(p);
  }

  public async request(
    id: CallMessageId, data?: unknown, timeout = 10000): Promise<unknown> {
    if (import.meta.env.Dev) {
      const { mockHandler } = await import('@/mock/handler')
      return mockHandler.mockRequest(id, data, timeout);
    }

    if (!this._api) {
      return Promise.reject("VSCode API not available");
    }

    const tag = this._generateTag();

    return new Promise((resolve, reject) => {
      const r: CallMessage = { id, tag, data };
      this._pendingCalls.set(tag, resolve);
      this._api!.postMessage(r);

      if (timeout > 0) {
        setTimeout(() => {
          if (this._pendingCalls.has(tag)) {
            this._pendingCalls.delete(tag);
            reject(new Error(`Call request timed out: ${id}`));
          }
        }, timeout);
      }
    });
  }

  private _onDidReceiveCallMessage(m: CallMessage) {
    if (!m.tag || !this._pendingCalls.has(m.tag)) {
      return;
    }

    const resolve = this._pendingCalls.get(m.tag);
    this._pendingCalls.delete(m.tag);

    if (resolve) {
      resolve(m.data);
    }
  }
  
  private _generateTag(): string {
    return `call_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const vscodeApi = new VSCodeApiWrapper();
