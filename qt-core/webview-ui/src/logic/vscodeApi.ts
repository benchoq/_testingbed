// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import { PushId, type Push, RequestId, type Request, 
  type Transmission, type Reply,
  isPush, isRequest
} from '@shared/message';
import type { WebviewApi } from "vscode-webview";

class VSCodeApiWrapper {
  private readonly _api: WebviewApi<unknown> | undefined;
  private _pendingRequests = new Map<string, (value: any) => void>();
  private _onPushReceived = (p: Push) => {};

  constructor() {
    if (typeof acquireVsCodeApi === "function") {
      this._api = acquireVsCodeApi();
    }
  
    window.addEventListener("message", (e: MessageEvent) => {
      if (!e.origin.startsWith("vscode-webview://")) {
        console.log("received message, but the origin is not expected")
        return;
      }

      const transmission = e.data;

      if (isPush(transmission)) {
        this._onPushReceived(transmission as Push);
      } else if (isRequest(transmission)) {
        this._onReplyReceived(transmission as Reply);
      } else {
        console.warn("Unknown transmission");
      }
    });
  }

  public onPushReceived(handler: (p: Push) => void) {
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
    
    this._api.postMessage({ id, data } as Push);
  }

  public async request<T = unknown>(
    id: RequestId, data?: T, timeout = 10000): Promise<T> {
    if (!this._api) {
      return Promise.reject("VSCode API not available");
    }

    const uniqueId = this._generateRequestId();

    return new Promise<T>((resolve, reject) => {
      this._pendingRequests.set(uniqueId, resolve);
      this._api!.postMessage({ id, uniqueId, data } as Request);

      if (timeout > 0) {
        setTimeout(() => {
          if (this._pendingRequests.has(uniqueId)) {
            this._pendingRequests.delete(uniqueId);
            reject(new Error(`Request timeout for ${id}`));
          }
        }, timeout);
      }
    });
  }

  private _onReplyReceived(r: Reply) {
    if (!r.uniqueId || !this._pendingRequests.has(r.uniqueId)) {
      return;
    }

    const resolve = this._pendingRequests.get(r.uniqueId);
    this._pendingRequests.delete(r.uniqueId);

    if (resolve) {
      resolve(r.data);
    }

    console.log(r);
  }
  
  private _generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const vscodeApi = new VSCodeApiWrapper();
