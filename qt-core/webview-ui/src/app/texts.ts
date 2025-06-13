// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export const wizard = {
  title: 'Create a new project or file',
  buttons: {
    create: 'Create',
    rename: 'Rename',
    duplicate: 'Duplicate',
    delete: 'Delete',
    update: 'Save',
    saveAs: 'Save as ...',
    saveAsTooltip: 'Create a new custom preset with current options'
  },

  types: {
    project: 'Project',
    file: 'File'
  },

  presetList: 'Available presets',
  description: 'Description',
  options: 'Options',
  generation: (name: string) => `Generate "${name}"`,

  nameAndLocation: 'Name and location',
  name: 'Name',
  workingDir: 'Create in',
  workingDirTooltip: 'Browse',
  workingDirSaveCheckbox: 'Use as default project directory',

  enterNewPresetName: 'Enter a new name for the custom preset',
  confirmDeletePreset: 'Do you want to delete the preset?',

  presetNameError: {
    empty: 'The name cannot be empty',
    invalid: 'The name is invalid',
    alreadyTaken: 'This name is already taken'
  }
};

export const loading = {
  busy: 'Loading...',
  close: 'Close'
};
