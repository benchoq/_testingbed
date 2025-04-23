// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import { PushId, type PushData, CallId, type CallData, 
  type Reply,
  isPushData, isCallData
} from '@shared/message';
import type { WebviewApi } from "vscode-webview";

class VSCodeApiWrapper {
  private readonly _api: WebviewApi<unknown> | undefined;
  private _pendingRequests = new Map<string, (value: any) => void>();
  private _onPushReceived = (p: PushData) => {};

  constructor() {
    if (typeof acquireVsCodeApi === "function") {
      this._api = acquireVsCodeApi();
    }
  
    window.addEventListener("message", (e: MessageEvent) => {
      if (!e.origin.startsWith("vscode-webview://")) {
        console.log("received message, but the origin is not expected")
        return;
      }

      const data = e.data;

      if (isPushData(data)) {
        this._onPushReceived(data as PushData);
      } else if (isCallData(data)) {
        this._onCallDataReceived(data as Reply);
      } else {
        console.warn("Unknown transmission");
      }
    });
  }

  public onPushReceived(handler: (p: PushData) => void) {
    this._onPushReceived = handler
  }

  public isValid(): boolean {
    return (this._api !== undefined);
  }

  public push<T = unknown>(id: PushId, data?: T) {
    if (!this._api) {
      console.log("api is invalid");
      return;
    }
    
    const p: PushData = { id, data };
    this._api.postMessage(p);
  }

  public async request<T = unknown>(
    id: CallId, data?: T, timeout = 10000): Promise<T> {
    if (!this._api) {
      return Promise.reject("VSCode API not available");
    }

    const tag = this._generateRequestTag();

    return new Promise<T>((resolve, reject) => {
      const r: CallData = { id, tag, data };
      this._pendingRequests.set(tag, resolve);
      this._api!.postMessage(r);

      if (timeout > 0) {
        setTimeout(() => {
          if (this._pendingRequests.has(tag)) {
            this._pendingRequests.delete(tag);
            reject(new Error(`Request timeout for ${id}`));
          }
        }, timeout);
      }
    });
  }

  private _onCallDataReceived(r: Reply) {
    if (!r.tag || !this._pendingRequests.has(r.tag)) {
      return;
    }

    const resolve = this._pendingRequests.get(r.tag);
    this._pendingRequests.delete(r.tag);

    if (resolve) {
      resolve(r.data);
    }

    console.log(r);
  }
  
  private _generateRequestTag(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const vscodeApi = new VSCodeApiWrapper();
