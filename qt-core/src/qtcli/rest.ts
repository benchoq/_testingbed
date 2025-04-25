// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";
import axios from "axios";

// import _prompt from "./dev-data/_prompt.json";
// import _presetsFile from "./dev-data/_presets_file.json";
// import _presetsProject from "./dev-data/_presets_project.json";

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

  private readonly maxRetries = 10;
  private readonly retryDelay = 200;

  public async call(req: QtcliRestRequest, attempt = 0): Promise<QtcliRestResponse> {
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
      if ((req.method === 'get') && (attempt < this.maxRetries)) {
        console.warn(`Request failed. Retrying in ${this.retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.call(req, attempt + 1);
      }

      if (err.response) {
        return {
          data: err.response.data,
          status: err.response.status
        }
      }

      throw err;
    }
  }
  
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
}

// async function fakeResponse(req: QtcliRestRequest): Promise<QtcliRestResponse> {
//   function handleRequest(): QtcliRestResponse {
//     try {
//       if (!req.method || !req.endpoint) {
//         throw new Error("API request is invalid");
//       }

//       // simulate error case
//       if (Math.random() < 0.2) {
//         return new QtcliRestResponse(req, undefined, "Not Found");
//       }

//       if (req.method === "get") {
//         if (req.endpoint === "/presets") {
//           const type = _.get(req.params, "type", "") as string;
//           const data = (type === "file") ? _presetsFile : _presetsProject;
//           return new QtcliRestResponse(req, data);
//         } 
//         else if (req.endpoint.endsWith("/prompt")) {
//           return new QtcliRestResponse(req, _prompt);
//         }
//       }
//     } catch (err: any) {
//       return new QtcliRestResponse(req, undefined, err.message);
//     }

//     return new QtcliRestResponse(req, undefined, "Not Supported");
//   }

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(handleRequest());
//     }, 500);
//   });
// }

export const qtcliApi = new QtcliRestClient();
