// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";

import { PushId, RequestId, type Push } from "@shared/message";
import { qtcliApi } from "@/logic/qtcliApi";
import { vscodeApi } from "@/logic/vscodeApi";
import { type Preset } from './types.svelte';
import { configs, inputValidationResult, presets, loading } from './states.svelte';

vscodeApi.onPushReceived((p: Push) => {
  if (p.id === PushId.PanelInit) {
    if (p.data) {
//       configs.type = "project";
//       configs.name = _.get(payload, "name", configs.name) as string;
//       configs.workingDir = _.get(payload, "workingDir", configs.workingDir) as string;
//       configs.saveWorkingDir = _.get(payload, "saveWorkingDir", configs.saveWorkingDir) as boolean;
    }

    loadPresets();
  }
})

export const uploadSaveWorkDir = (checked: any) => {
  // vscodeApi.request(MessageId.SaveWorkingDirChanged, checked);
}

export const notifyClosed = () => {
  // qtcliApi.delete("/server");
  vscodeApi.push(PushId.ViewClosed);
}

export const changeWorkingDir = () => {
  vscodeApi
    .request(RequestId.ViewSelectWorkingDir, configs.workingDir)
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
    qtcliApi.get(`/presets/${preset.id}/prompt`)
      .then((res) => { presets.selectedPrompt = res.data })
      .catch((e) => { loading.setError(e) })
      .finally(() => { loading.clear() });
  }
}

export const loadPresets = () => {
  loading.start()
  const endPoint = "/presets";
  const params = { type: configs.type };

  qtcliApi
    .get(endPoint, params)
    .catch((e) => { loading.setError(e) })
    .finally(() => { loading.clear() })
    .then((res: any) => {
      if (res.request.endpoint.startsWith("/presets/prompt")) {
        presets.selectedPrompt = res.data;
      } else if (res.request.endpoint === "/presets") {
        presets.all = res.data;

        if (res.data.length !== 0) {
          setSelectedPreset(res.data[0], 0)
        }
      }
    });
};

export const createItemFromSelectedPreset = async () => {
  // if (!presets.selected) {
  //   return;
  // }

  // const data = { 
  //   name: configs.name, 
  //   workingDir: configs.workingDir, 
  //   presetId: presets.selected?.id
  // }

  // qtcliApi.post("/items", data)
  //   .then((res) => { vscodeApi.request(MessageId.ItemCreated, res.data) })
  //   .catch((e) => { console.log(e); });
};

export const setName = (name: string) => {
  configs.name = name;
  void validateNameAndDir();
}

export const setWorkingDir = (dir: string) => {
  configs.workingDir = dir;
  void validateNameAndDir();
}

const validateNameAndDir = async () => {
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
