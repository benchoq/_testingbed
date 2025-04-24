// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";

import { PushMessageId, CallMessageId, type PushMessage } from "@shared/message";
import { vscodeApi } from "@/logic/vscodeApi";
import { type Preset } from './types.svelte';
import { configs, presets, loading } from './states.svelte';

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

export const notifyClosed = () => {
  vscodeApi.push(PushMessageId.ViewClosed);
}

export const changeWorkingDir = () => {
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

export const createItemFromSelectedPreset = async () => {
  if (!presets.selected) {
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
  console.log(configs.name, configs.workingDir);
  // if (configs.name.length === 0) {
  //   inputValidationResult.nameError = "Name is empty"
  // } else {
  //   inputValidationResult.nameError = ""
  // }

  // if (configs.workingDir.length === 0) {
  //   inputValidationResult.workingDirError = "Working directory is empty"
  // } else {
  //   const res = await vscodeApi.request(MessageId.RequestCheckDirectoryExists, configs.workingDir)
  //   if (Boolean(res) !== true) {
  //     console.log("dir check =", res)
  //     inputValidationResult.workingDirError = "Dir doesn't exist";
  //   } else {
  //     inputValidationResult.workingDirError = ""
  //   }
  // }
}
