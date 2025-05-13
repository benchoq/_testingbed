// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";

import { CallMessageId } from '@shared/message';
import _prompt from "./data/_prompt.json";
import _presetsFile from "./data/_presets_file.json";
import _presetsClass from "./data/_presets_class.json";
import _presetsProject from "./data/_presets_project.json";

class MockHandler {
  public async mockRequest(
    id: CallMessageId, data?: unknown, timeout = 10000): Promise<unknown> {
    if (id === CallMessageId.ViewCallQtcliApi) {
      return mockViewCallQtcliApi(data);
    }

    return Promise.reject("mock handler doesn't implement this");
  }
}

function mockViewCallQtcliApi(data?: unknown) {
  const method = _.get(data, "method", '') as string;
  const endpoint = _.get(data, "endpoint", '') as string;
  const request = { method, endpoint }

  if (method === "get") {
    if (endpoint === "/presets") {
      const type = _.get(data, "params.type", '') as string;
      const presets = (type === "project") ?
        _presetsProject : (type === "class" ? _presetsClass : _presetsFile);
      return Promise.resolve({ data: presets, request });
    }

    if (endpoint.endsWith("/prompt")) {
      return Promise.resolve({ data: _prompt, request })
    }
  }

  return Promise.resolve({
    error: `mock not supported: ${method}, ${endpoint}`
  })
}

export const mockHandler = new MockHandler();