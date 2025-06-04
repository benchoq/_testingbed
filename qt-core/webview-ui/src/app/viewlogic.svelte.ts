// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { vscode } from '@/app/vscode';
import { isErrorResponse } from '@shared/types';
import { type CommandReply, CommandId } from '@shared/message';
import { type Preset, isPreset, isPresetArray } from './types.svelte';
import { data, input, ui } from './states.svelte';

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
    .post(CommandId.UiSelectWorkingDir, input.workingDir)
    .then((data) => {
      if (typeof data === 'string' && input.workingDir != data) {
        input.workingDir = data;
        void validateInput();
      }
    })
    .catch((e) => {
      reportUiError('Error selecting working dir', e);
    });
}

export async function setPresetType(type: string) {
  if (data.selected.type !== type) {
    data.selected.type = type;
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
  const index = data.presets.findIndex(p => p.name === name);
  if (index !== -1) {
    setSelectedPresetAt(index);
  }
}

export async function setSelectedPresetAt(index: number) {
  if (!data.serverReady) return;
  if (index < 0 || index >= data.presets.length) return;

  const preset = data.presets[index];
  if (preset) {
    data.selected.preset = preset;
    data.selected.presetIndex = index;
    data.selected.unsavedOptionChanges = {};
    updateToolbarStates();

    await refreshPresetDetails();
  }
}

async function refreshPresetDetails() {
  const preset = data.selected.preset;
  if (!preset) {
    return;
  }

  if (preset.id.length > 0) {
    try {
      const r = await vscode.post(CommandId.UiGetPresetById, preset.id);
      if (isPreset(r)) {
        data.selected.preset = r;
        updateToolbarStates();
      }
    } catch (e) {
      reportUiError('Error getting preset by id', e);
    }
  }
}

export function createPresetDisplayText(preset: Preset | undefined): string {
  if (!preset) return '';
  return isDefaultPreset(preset.name) ? preset.meta.title : preset.name;
}

export async function createItemFromSelectedPreset() {
  if (!data.selected.preset) return;

  try {
    await vscode.post(CommandId.UiItemCreationRequested, {
      type: data.selected.type,
      name: input.name,
      workingDir: input.workingDir,
      presetId: data.selected.preset?.id,
      options: $state.snapshot(data.selected.unsavedOptionChanges),
      saveProjectDir: input.saveProjectDir
    });
  } catch (e) {
    reportUiError('Error creating item', e);
  }
}

export async function validateInput() {
  if (!data.serverReady) return;

  const payload = {
    name: input.name,
    workingDir: input.workingDir,
    presetId: data.selected.preset?.id
  };

  try {
    await vscode.post(CommandId.UiValidateInputs, payload);
    clearInputErrors();
  } catch (e) {
    clearInputErrors();

    if (isErrorResponse(e)) {
      e.details?.forEach(function (item) {
        const field = item.field.toLowerCase();
        if (field === 'name') input.issues.name.loadFrom(item);
        if (field === 'workingdir') input.issues.workingDir.loadFrom(item);
      });

      ui.canCreate = !(
        input.issues.name.isError() || input.issues.workingDir.isError()
      );
    }
  }
}

export async function createCustomPreset(name: string) {
  const presetId = data.selected.preset?.id;
  const options = $state.snapshot(data.selected.unsavedOptionChanges)
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
  const presetId = data.selected.preset?.id;
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
  const presetId = data.selected.preset?.id;
  const options = $state.snapshot(data.selected.unsavedOptionChanges)
  if (!presetId || Object.keys(options).length === 0) {
    return;
  }
  
  try {
    const payload = { presetId, options };
    await vscode.post(CommandId.UiUpdateCustomPreset, payload);
    await setSelectedPresetAt(data.selected.presetIndex);
  } catch (e) {
    reportUiError('Error saving preset', e);
  }
}

export async function deleteCustomPreset() {
  const presetId = data.selected.preset?.id;
  if (!presetId) {
    return;
  }

  try {
    await vscode.post(CommandId.UiDeleteCustomPreset, presetId);
    await loadPresets();
    await setSelectedPresetAt(Math.max(0, data.selected.presetIndex - 1));
  } catch (e) {
    reportUiError('Error deleting preset', e);
  }
}

export function isDefaultPreset(name: string | undefined): boolean {
  return ((name !== undefined) && name.startsWith('@'));
}

export function isCustomPreset(name: string | undefined): boolean {
  return ((name !== undefined) && !name.startsWith('@'));
}

// helpers
function updateToolbarStates() {
  if (data.selected.preset === undefined) {
    ui.preset.canDelete = false;
    ui.preset.canRename = false;
    ui.preset.canSave = false;
    ui.preset.canCreate = false;
    return;
  }

  const steps = data.selected.preset.prompt?.steps;
  const custom = isCustomPreset(data.selected.preset.name);

  ui.preset.canDelete = custom;
  ui.preset.canRename = custom;
  ui.preset.canSave = custom;
  ui.preset.canCreate = !custom && (steps !== undefined) && (steps.length > 0);
}

async function loadPresets() {
  if (!data.serverReady) return;

  try {
    const r = await vscode.post(CommandId.UiGetAllPresets, data.selected.type);
    if (isPresetArray(r)) {
      data.presets = r;
    }
  } catch (e) {
    reportUiError('Error loading presets', e);
  }
}

function loadDefaultWorkingDir() {
  let candidate = input.workingDir;

  if (import.meta.env.DEV) {
    candidate = '/dev';
  } else {
    candidate =
      data.selected.type === 'file'
        ? data.configs.newFileBaseDir
        : data.configs.newProjectBaseDir;
  }

  if (input.workingDir !== candidate) {
    input.workingDir = candidate;
  }
}

async function selectAnyPresetAndValidate() {
  if (data.presets.length > 0) {
    await setSelectedPresetAt(0);
    await validateInput();
  }
}

function reportUiError(msg: string, e?: unknown) {
  const detail = e instanceof Error ? e.message : String(e);
  void vscode.post(CommandId.UiHasError, `${msg}: ${detail}`);
}

function clearInputErrors() {
  input.issues.name.clear();
  input.issues.workingDir.clear();
  ui.canCreate = true;
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
