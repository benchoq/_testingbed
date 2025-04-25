// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";

import { PushMessageId, CallMessageId, type PushMessage } from "@shared/message";
import { vscodeApi } from "@/logic/vscodeApi";
import { type Preset } from './types.svelte';
import { configs, presets, loading, inputValidationResult } from './states.svelte';

vscodeApi.onDidReceivePushMessage((p: PushMessage) => {
  if (p.id === PushMessageId.PanelInit) {
    if (p.data) {
      configs.type = "project";
      configs.name = _.get(p.data, "name", configs.name) as string;
      configs.workingDir = _.get(p.data, "workingDir", configs.workingDir) as string;
      configs.saveWorkingDir = _.get(p.data, "saveWorkingDir", configs.saveWorkingDir) as boolean;
    }

    loadPresets();
  }
})

export const onModalClosed = () => {
  vscodeApi.push(PushMessageId.ViewClosed);
}

export const onWorkingDirBrowseClicked = () => {
  vscodeApi
    .request(CallMessageId.ViewSelectWorkingDir, configs.workingDir)
    .then((data) => { configs.workingDir = data as string; })
    .catch((e) => { console.log("catch,", e) })
};

export const setPresetType = (type: string) => {
  configs.type = type;
  loadPresets();
}

export const setSelectedPreset = (preset: Preset, index: number) => {
  presets.selected = preset
  presets.selectedIndex = index;

  if (preset.id.length > 0) {
    const method = "get"
    const endpoint = `/presets/${preset.id}/prompt`;

    vscodeApi
      .request(CallMessageId.ViewCallQtcliApi, { method, endpoint })
      .then((res: any) => { presets.selectedPrompt = res.data })
      .catch((e) => { loading.setError(e) })
      .finally(() => { loading.clear() });
  }
}

export const loadPresets = () => {
  loading.start()

  const method = "get"
  const endpoint = "/presets";
  const params = { type: configs.type };

  vscodeApi
    .request(CallMessageId.ViewCallQtcliApi, { method, endpoint, params })
    .then((res: any) => {
      presets.all = res.data;
      if (res.data.length !== 0) {
        setSelectedPreset(res.data[0], 0)
      }
    })
};

export function createPresetDisplayText(preset: any) {
  if (preset.name.startsWith("@")) {
    return preset.meta.title;
  } else {
    return preset.name;
  }
}

export const createItemFromSelectedPreset = async () => {
  if (!presets.selected) {
    // TODO: error display
    return;
  }

  const data = {
    // must-have
    name: configs.name, 
    workingDir: configs.workingDir, 
    presetId: presets.selected?.id,
    
    // options
    saveWorkingDir: configs.saveWorkingDir,
  }

  vscodeApi
    .request(CallMessageId.ViewCreateItem, data)
    .then((res) => { console.log("item created") })
};

export const validateInputs = async () => {
  if (!presets.selected) {
    // TODO: error display
    return;
  }

  const method = "post"
  const endpoint = "/items/validate";
  const data = {
    name: configs.name, 
    workingDir: configs.workingDir, 
    presetId: presets.selected?.id,
  }

  vscodeApi
    .request(CallMessageId.ViewCallQtcliApi, { method, endpoint, data })
    .then((res: any) => { 
      // TODO: make this type safe, robust ...
      console.log(res)
      const success = _.get(res, "data.success", false) as boolean;
      if (success) {
        inputValidationResult.nameError = ""
        inputValidationResult.workingDirError = ""
        return;
      }

      const details = _.get(res, "data.error.details", []);

      details.forEach((item: any) => {
        const field = _.get(item, "field", "") as string;
        const message = _.get(item, "message", "") as string;

        if (field === "name" && message.length !== 0) {
          inputValidationResult.nameError = message;
        }

        if (field === "workingDir" && message.length !== 0) {
          inputValidationResult.workingDirError = message;
        }
      });
    })
}
