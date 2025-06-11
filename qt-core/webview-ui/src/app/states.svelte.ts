// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type Preset, PresetWrapper, InputIssue } from './types.svelte';

export const data = $state({
  serverReady: false,
  configs: {
    newFileBaseDir: '',
    newProjectBaseDir: ''
  },
});

export const preset = $state({
  all: [] as Preset[],
  selection: new PresetWrapper()
});

export const ui = $state({
  loading: {
    busy: false,
    error: undefined as unknown,
    forceHidden: false,
    delayedTimerId: null as NodeJS.Timeout | null
  },

  activeDialog: {
    input: undefined as 'create' | 'rename' | 'duplicate' | undefined,
    confirm: undefined as 'delete' | undefined,
  },

  popups: {
    editCustomPreset: false,
  },
  
  input: {
    name: 'untitled',
    workingDir: '',
    saveProjectDir: false,
    issues: {
      name: new InputIssue(),
      workingDir: new InputIssue()
    }
  },

  selectedType: 'project',
  selectedPresetIndex: -1,
  unsavedOptionChanges: {} as Record<string, any>,
  canCreateItem: true,
});
