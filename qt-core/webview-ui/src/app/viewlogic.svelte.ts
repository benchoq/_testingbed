// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";

import { PushMessageId, CallMessageId, type PushMessage } from "@shared/message";
import { vscodeApi } from "@/logic/vscodeApi";
import { type Preset } from './types.svelte';
import { configs, presets, loading, inputValidation, wizard, initData } from './states.svelte';
import * as utils from "@/logic/utils";

vscodeApi.onDidReceivePushMessage((p: PushMessage) => {
  if (p.id === PushMessageId.PanelInit) {
    if (p.data) {
      initData.project.workingDir = _.get(p.data, "project.workingDir", initData.project.workingDir) as string;
      initData.others.workingDir = _.get(p.data, "others.workingDir", initData.others.workingDir) as string;
    }
  }
})

export function onAppMount() {
  if (utils.isDev()) {
    loadPresets();
    return;
  }

  loading.start()

  void vscodeApi
    .request(CallMessageId.ViewCheckIfQtcliReady)
    .then((res: any) => {
      loading.clear();
      loadPresets();
    })
}

export const onModalClosed = () => {
  vscodeApi.push(PushMessageId.ViewWizardClosed);
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
      .then((res: any) => { 
        presets.selectedPrompt = res.data
        console.log(res.data);
      })
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

  vscodeApi.push(PushMessageId.ViewCreateItem, data)
};

export const dryRunGenerator = async () => {
  if (!presets.selected) {
    // TODO: error display
    return;
  }

  const body = {
    method: "post",
    endpoint: "/items",
    params: { dry_run: true },
    data: {
      name: configs.name, 
      workingDir: configs.workingDir, 
      presetId: presets.selected?.id,
    }
  }

  vscodeApi
    .request(CallMessageId.ViewCallQtcliApi, body)
    .then((res: any) => { 
      // console.log(res)
      // res ==> { data: {}, status: number }
      // TODO: make this type safe, robust ...
      inputValidation.nameError = ""
      inputValidation.workingDirError = ""
      wizard.buttons.finish.disabled = false

      if (_.has(res, "data.error")) {
        const details = _.get(res, "data.error.details", []);

        details.forEach((item: any) => {
          const field = (_.get(item, "field", "") as string).toLowerCase();
          const message = _.get(item, "message", "") as string;
          if (message.length !== 0) {
            if (field === "name") inputValidation.nameError = message;
            if (field === "workingdir") inputValidation.workingDirError = message;
          }
        });

        wizard.buttons.finish.disabled = true
      }
    })
}
