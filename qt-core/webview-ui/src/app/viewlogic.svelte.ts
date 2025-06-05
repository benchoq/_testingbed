// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { vscode } from '@/app/vscode';
import { isErrorResponse } from '@shared/types';
import { type CommandReply, CommandId } from '@shared/message';
import { isPreset, isPresetArray } from './types.svelte';
import { data, preset, ui } from './states.svelte';

export async function onAppMount() {
  vscode.onDidReceiveNotification(async (r: CommandReply) => {
    if (r.id === CommandId.PanelRevealed && r.payload) {
      data.configs = {
        ...data.configs,
        ...r.payload
      };

      try {
        void loadDefaultWorkingDir();
        await validateInput();
      } catch (e) {
        reportUiError('Error in PanelRevealed handler:', e);
      }
    }
  });

  try {
    startLoading();

    await vscode.post(CommandId.UiCheckIfQtcliReady);
    data.serverReady = true;

    await loadPresets();
    await selectAnyPresetAndValidate();
  } catch (e) {
    reportUiError('Error during onAppMount', e);
  } finally {
    endLoading();
  }
}

export function onModalClosed() {
  void vscode.post(CommandId.UiClosed);
}

export function onWorkingDirBrowseClicked() {
  void vscode
    .post(CommandId.UiSelectWorkingDir, ui.input.workingDir)
    .then((data) => {
      if (typeof data === 'string' && ui.input.workingDir != data) {
        ui.input.workingDir = data;
        void validateInput();
      }
    })
    .catch((e) => {
      reportUiError('Error selecting working dir', e);
    });
}

export async function setPresetType(type: string) {
  if (ui.selectedType !== type) {
    ui.selectedType = type;
    loadDefaultWorkingDir();

    try {
      startLoading(1000);
      await loadPresets();
      await selectAnyPresetAndValidate();
    } catch (e) {
      reportUiError('Error while setting preset type', e);
    } finally {
      endLoading();
    }
  }
}

export async function setSelectedPresetByName(name: string) {
  const index = preset.all.findIndex(p => p.name === name);
  if (index !== -1) {
    setSelectedPresetAt(index);
  }
}

export async function setSelectedPresetAt(index: number) {
  if (!data.serverReady) return;
  if (index < 0 || index >= preset.all.length) return;

  const p = preset.all[index];
  if (p) {
    ui.selectedPresetIndex = index;
    ui.unsavedOptionChanges = {};
    preset.selection.setData(p);

    await refreshPresetDetails();
  }
}

async function refreshPresetDetails() {
  if (!preset.selection.isValid()) {
    return;
  }

  try {
    const id = preset.selection.id;
    if (id.length === 0) {
      return;
    }

    const r = await vscode.post(CommandId.UiGetPresetById, id);
    if (isPreset(r)) {
      preset.selection.setData(r);
    }
  } catch (e) {
    reportUiError('Error getting preset by id', e);
  }
}

export async function createItemFromSelectedPreset() {
   if (!preset.selection.isValid()) {
    return;
  }

  try {
    await vscode.post(CommandId.UiItemCreationRequested, {
      type: ui.selectedType,
      name: ui.input.name,
      workingDir: ui.input.workingDir,
      presetId: preset.selection.id,
      options: $state.snapshot(ui.unsavedOptionChanges),
      saveProjectDir: ui.input.saveProjectDir
    });
  } catch (e) {
    reportUiError('Error creating item', e);
  }
}

export async function validateInput() {
  if (!data.serverReady) return;

  const payload = {
    name: ui.input.name,
    workingDir: ui.input.workingDir,
    presetId: preset.selection.id
  };

  try {
    await vscode.post(CommandId.UiValidateInputs, payload);
    clearInputErrors();
  } catch (e) {
    clearInputErrors();

    if (isErrorResponse(e)) {
      e.details?.forEach(function (item) {
        const field = item.field.toLowerCase();
        if (field === 'name') ui.input.issues.name.loadFrom(item);
        if (field === 'workingdir') ui.input.issues.workingDir.loadFrom(item);
      });

      ui.canCreateItem = !(
        ui.input.issues.name.isError() || ui.input.issues.workingDir.isError()
      );
    }
  }
}

export async function createCustomPreset(name: string) {
  const presetId = preset.selection.id;
  const options = $state.snapshot(ui.unsavedOptionChanges)
  if (!presetId) {
    return;
  }
  
  try {
    const payload = { name, presetId, options }
    const r = await vscode.post(CommandId.UiCreateCustomPreset, payload);
    await loadPresets();
    await setSelectedPresetByName(name);
  } catch (e) {
    reportUiError('Error saving preset', e);
  }
}


export async function renameCustomPreset(newName: string) {
  const presetId = preset.selection.id;
  if (!presetId || newName.length === 0) {
    return;
  }

  try {
    const payload = { name: newName, presetId };
    await vscode.post(CommandId.UiRenameCustomPreset, payload);
    await loadPresets();
    await setSelectedPresetByName(newName);
  } catch (e) {
    reportUiError('Error deleting preset', e);
  }
}

export async function updateCustomPreset() {
  const presetId = preset.selection.id;
  const options = $state.snapshot(ui.unsavedOptionChanges)
  if (!presetId || Object.keys(options).length === 0) {
    return;
  }
  
  try {
    const payload = { presetId, options };
    await vscode.post(CommandId.UiUpdateCustomPreset, payload);
    await setSelectedPresetAt(ui.selectedPresetIndex);
  } catch (e) {
    reportUiError('Error saving preset', e);
  }
}

export async function deleteCustomPreset() {
  const presetId = preset.selection.id;
  if (!presetId || !preset.selection.isCustomPreset()) {
    return;
  }

  try {
    await vscode.post(CommandId.UiDeleteCustomPreset, presetId);
    await loadPresets();
    await setSelectedPresetAt(Math.max(0, ui.selectedPresetIndex - 1));
  } catch (e) {
    reportUiError('Error deleting preset', e);
  }
}

// helpers
async function loadPresets() {
  if (!data.serverReady) return;

  try {
    const r = await vscode.post(CommandId.UiGetAllPresets, ui.selectedType);
    if (isPresetArray(r)) {
      preset.all = r;
    }
  } catch (e) {
    reportUiError('Error loading presets', e);
  }
}

function loadDefaultWorkingDir() {
  let candidate = ui.input.workingDir;

  if (import.meta.env.DEV) {
    candidate = '/dev';
  } else {
    candidate =
      ui.selectedType === 'file'
        ? data.configs.newFileBaseDir
        : data.configs.newProjectBaseDir;
  }

  if (ui.input.workingDir !== candidate) {
    ui.input.workingDir = candidate;
  }
}

async function selectAnyPresetAndValidate() {
  if (preset.all.length > 0) {
    await setSelectedPresetAt(0);
    await validateInput();
  }
}

function reportUiError(msg: string, e?: unknown) {
  const detail = e instanceof Error ? e.message : String(e);
  void vscode.post(CommandId.UiHasError, `${msg}: ${detail}`);
}

function clearInputErrors() {
  ui.input.issues.name.clear();
  ui.input.issues.workingDir.clear();
  ui.canCreateItem = true;
}

// loading mask
function startLoading(delay = 0) {
  ui.loading.busy = true;
  ui.loading.error = undefined;
  clearLoadingDelayTimer();

  if (delay === 0) {
    ui.loading.forceHidden = false;
  } else {
    ui.loading.forceHidden = true;
    ui.loading.delayedTimerId = setTimeout(function () {
      ui.loading.forceHidden = false;
    }, delay);
  }
}

function endLoading() {
  clearLoadingDelayTimer();
  ui.loading.busy = false;
  ui.loading.error = undefined;
}

function clearLoadingDelayTimer() {
  if (ui.loading.delayedTimerId) {
    clearTimeout(ui.loading.delayedTimerId);
    ui.loading.delayedTimerId = null;
  }
}
