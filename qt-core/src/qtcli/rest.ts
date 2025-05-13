// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import axios from "axios";

export interface QtcliRestRequest {
  method: string;
  endpoint: string;
  params?: any;
  data?: any;
}

export interface QtcliRestResponse {
  data: any;
  status: number;
}

export class QtcliRestClient {
  private _api = axios.create({
    baseURL: "http://localhost:8080/v1",
    timeout: 15 * 1000,
  });

  private readonly _maxRetries = 10;
  private readonly _retryDelay = 200;

   // convenients
   public async get(endpoint: string, params?: any) {
    return this.call({ method: "get", endpoint, params })
  }

  public async post(endpoint: string, data?: any) {
    return this.call({ method: "post", endpoint, data })
  }

  public async delete(endpoint: string) {
    return this.call({ method: "delete", endpoint })
  }

  public async call(req: QtcliRestRequest): Promise<QtcliRestResponse> {
    return this.callWithRetry(req, this._maxRetries)
  }

  public async callWithRetry(req: QtcliRestRequest, attempt: number = 0): Promise<QtcliRestResponse> {
    try {
      const res = await this._api({
        method: req.method,
        url: req.endpoint,
        params: req.params,
        data: req.data 
      });

      return {
        data: res.data, 
        status: res.status,
      }
    } catch (err: any) {
      if (attempt < this._maxRetries) {
        console.warn(`Rest call failed, retrying in ${this._retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, this._retryDelay));
        return this.callWithRetry(req, attempt + 1);
      }

      if (err.response) {
        return {
          data: err.response.data,
          status: err.response.status
        }
      }
      
      return {
        data: err,
        status: 500
      }
    }
  }
}

export const qtcliApi = new QtcliRestClient();
