// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";

import { MessageId } from "@shared/message";
import { vscodeApi } from "@/logic/vscodeApi";
import { QtcliRestClient } from "@/logic/qtcliRestClient";
import { type Preset } from './types.svelte';
import { configs, presets, loading } from './states.svelte';

const qtcli = new QtcliRestClient();

vscodeApi.onNotification((id: MessageId, payload: unknown) => {
  if (id === MessageId.Initialize) {
    if (payload) {
      configs.type = _.get(payload, "type",  configs.type) as string;
      configs.name = _.get(payload, "name", configs.name) as string;
      configs.workingDir = _.get(payload, "workingDir", configs.workingDir) as string;
      configs.saveWorkingDir = _.get(payload, "saveWorkingDir", configs.saveWorkingDir) as boolean;
    }

    loadPresets();
  }
})

export const uploadSaveWorkDir = (checked: any) => {
  vscodeApi.notify(MessageId.SaveWorkingDirChanged, checked);
}

export const notifyClosed = () => {
  vscodeApi.notify(MessageId.WizardClosed);
}

export const changeWorkingDir = () => {
  vscodeApi
    .request(MessageId.RequestSelectFolder, configs.workingDir)
    .then((payload) => { configs.workingDir = payload as string; })
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
    qtcli.get(`/presets/${preset.id}/prompt`)
      .then((res) => { presets.selectedPrompt = res.data })
      .catch((e) => { loading.setError(e) })
      .finally(() => { loading.clear() });
  }
}

export const loadPresets = () => {
  loading.start()
  const endPoint = "/presets";
  const params = { type: configs.type };

  qtcli
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
  if (!presets.selected) {
    return;
  }

  const data = { 
    name: configs.name, 
    workingDir: configs.workingDir, 
    presetId: presets.selected?.id
  }

  qtcli.post("/items", data)
    .then((res) => { vscodeApi.notify(MessageId.ItemCreated, res.data) })
    .catch((e) => { console.log(e); });
};
