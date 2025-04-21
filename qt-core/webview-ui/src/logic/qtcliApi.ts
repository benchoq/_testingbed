// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";
import axios from "axios";

import _prompt from "./dev-data/_prompt.json";
import _presetsFile from "./dev-data/_presets_file.json";
import _presetsProject from "./dev-data/_presets_project.json";

export class QtcliRestRequest {
  constructor(
    public method: string,
    public endpoint: string,
    public params?: any,
    public data?: any
  ) {}
}

export class QtcliRestResponse {
  constructor(
    public request: QtcliRestRequest,
    public data: any,
    public error?: string
  ) {}
}

export class QtcliRestClient {
  private _api = axios.create({
    baseURL: "http://localhost:8080/v1",
    timeout: 15 * 1000,
  });

  private readonly maxRetries = 10;
  private readonly retryDelay = 200;

  public get = async (endpoint: string, params?: any) => {
    return await this._call(new QtcliRestRequest("get", endpoint, params))
  }

  public post = async (endpoint: string, data?: any) => {
    return await this._call(new QtcliRestRequest("post", endpoint, undefined, data))
  }

  private async _call(req: QtcliRestRequest, attempt = 0): Promise<QtcliRestResponse> {
    if (import.meta.env.DEV) {
      return await fakeResponse(req);
    }

    try {
      if (!req.method || !req.endpoint) {
        throw new Error("API request is invalid");
      }

      const res = await this._api({ 
        method: req.method,
        url: req.endpoint,
        params: req.params,
        data: req.data 
      });

      if (res.status >= 200 && res.status < 300) {
        return new QtcliRestResponse(req, res.data);
      } else {
        throw new Error(res.statusText)
      }
    } catch (err: any) {
      if ((req.method === 'get') && (attempt < this.maxRetries)) {
        console.warn(`Request failed. Retrying in ${this.retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this._call(req, attempt + 1);
      }

      return new QtcliRestResponse(req, undefined, err.message);
    }
  }
}

async function fakeResponse(req: QtcliRestRequest): Promise<QtcliRestResponse> {
  function handleRequest(): QtcliRestResponse {
    try {
      if (!req.method || !req.endpoint) {
        throw new Error("API request is invalid");
      }

      // simulate error case
      if (Math.random() < 0.2) {
        return new QtcliRestResponse(req, undefined, "Not Found");
      }

      if (req.method === "get") {
        if (req.endpoint === "/presets") {
          const type = _.get(req.params, "type", "") as string;
          const data = (type === "file") ? _presetsFile : _presetsProject;
          return new QtcliRestResponse(req, data);
        } 
        else if (req.endpoint.endsWith("/prompt")) {
          return new QtcliRestResponse(req, _prompt);
        }
      }
    } catch (err: any) {
      return new QtcliRestResponse(req, undefined, err.message);
    }

    return new QtcliRestResponse(req, undefined, "Not Supported");
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(handleRequest());
    }, 500);
  });
}

export const qtcliApi = new QtcliRestClient();
