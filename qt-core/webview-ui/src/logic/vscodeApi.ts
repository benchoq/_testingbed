// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import { MessageId } from '@shared/message';
import type { WebviewApi } from "vscode-webview";

class VSCodeApiWrapper {
  private readonly _api: WebviewApi<unknown> | undefined;
  private _pendingRequests = new Map<string, (value: any) => void>();
  private _onNotification = (id: MessageId, payload: unknown) => {};

  constructor() {
    if (typeof acquireVsCodeApi === "function") {
      this._api = acquireVsCodeApi();
      window.addEventListener("message", this._onMessageFromVscode.bind(this));
    }
  }

  public onNotification(f: (id: MessageId, payload: unknown) => void) {
    this._onNotification = f
  }

  public isValid(): boolean {
    return (this._api !== undefined);
  }

  public notify<T = unknown>(messageId: MessageId, payload?: T) {
    if (this._api) {
      this._api.postMessage({ messageId, payload });
    }
  }

  public async request<T = unknown>(
    messageId: MessageId, 
    payload?: T, 
    timeout = 10000): Promise<T> {
    if (!this._api) {
      console.log("oh.... vscode api is not available");
      return Promise.reject("VSCode API not available");
    }

    const requestId = this._generateRequestId();
    return new Promise<T>((resolve, reject) => {
      this._pendingRequests.set(requestId, resolve);
      console.log("posting...1", messageId, payload, requestId);
      this._api!.postMessage({ messageId, payload, requestId });
      console.log("posting...2", messageId, payload, requestId);

      if (timeout > 0) {
        setTimeout(() => {
          if (this._pendingRequests.has(requestId)) {
            this._pendingRequests.delete(requestId);
            console.log("posting...3, timeout", messageId, payload, requestId);
            reject(new Error(`Request timeout for ${messageId}`));
          }
        }, timeout);
      }
    });
  }

  private _onMessageFromVscode(e: MessageEvent) {
    if (!e.origin.startsWith("vscode-webview://")) {
      console.log("received message, but the origin is not expected")
      return;
    }

    const { requestId, messageId, payload } = e.data;
    if (requestId) {
      if (this._pendingRequests.has(requestId)) {
        const resolve = this._pendingRequests.get(requestId);
        this._pendingRequests.delete(requestId);
        if (resolve) {
          resolve(payload);
        }
      }
      return;
    }

    if (this._onNotification) {
      this._onNotification(messageId, payload);
    }
  }
  
  private _generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const vscodeApi = new VSCodeApiWrapper();
