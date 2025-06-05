// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { CommandId } from '@shared/message';
import { preset } from '@/app/states.svelte';
import _presetsFile from './data/_presets_file.json';
import _presetsProject from './data/_presets_project.json';
import _presetCppQtQuick from './data/_preset_cppqtquick.json';
import _presetCustom from './data/_preset_custom.json';

class MockHandler {
  public async mockRequest<T = unknown>(
    id: CommandId,
    payload?: unknown
  ): Promise<T> {
    switch (id) {
      case CommandId.UiCheckIfQtcliReady:
        return new Promise<T>((resolve) => {
          setTimeout(() => {
            resolve({ status: 'ready' } as T);
          }, 1_000);
        });

      case CommandId.UiGetAllPresets: {
        const type = String(payload);
        const presets = type === 'project' ? _presetsProject : _presetsFile;
        return presets as T;
      }

      case CommandId.UiGetPresetById: {
        if (preset.selection.name === 'ttt') {
          return _presetCustom as T;
        } else {
          return _presetCppQtQuick as T;
        }
      }

      default:
        return Promise.reject(new Error("mock handler doesn't implement this"));
    }
  }
}

export const mockHandler = new MockHandler();
