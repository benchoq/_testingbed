// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type Preset, InputIssue } from './types.svelte';

export const data = $state({
  serverReady: false,
  configs: {
    newFileBaseDir: '',
    newProjectBaseDir: ''
  },
  presets: [] as Preset[],
  selected: {
    type: 'project',
    preset: undefined as Preset | undefined,
    presetIndex: -1,
    optionChanges: {} as Record<string, any>
  },
});

export const input = $state({
  name: 'untitled',
  workingDir: '',
  saveProjectDir: false,

  issues: {
    name: new InputIssue(),
    workingDir: new InputIssue()
  }
});

export const ui = $state({
  loading: {
    busy: false,
    error: undefined as unknown,
    forceHidden: false,
    delayedTimerId: null as NodeJS.Timeout | null
  },

  toolbar: {
    canDelete: false,
    canRename: false,
    canSave: false,
    canCreate: false
  },

  canCreate: true
});
