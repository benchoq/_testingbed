// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";
import { type PresetInfo } from "./types.svelte";
import PageParamInput from "./PageParamInput.svelte";
import PagePresetSelector from "./PagePresetSelector.svelte";

export const presets = $state<PresetInfo>({
  all: [],
  selected: undefined,
  selectedIndex: -1,
  selectedPrompt: undefined,
});

export const configs = $state({
  type: "project",
  name: "untitled",
  workingDir: "",
  saveWorkingDir: false,
})

export const initData = $state({
  project: {
    workingDir: "",
    saveWorkingDir: true
  },
  
  others: {
    workingDir: ""
  }
})

export const inputValidation = $state({
  nameError: "",
  workingDirError: "",
})

export const wizard = $state({
  pages: [
    { component: PagePresetSelector, title: "Select what to create" },
    { component: PageParamInput, title: "Configure details" }
  ],
  currentIndex: 0,
  buttons: {
    back: {
      visible: true,
    },
    next: { 
      visible: true,
    },
    finish: { 
      visible: true,
      disabled: false,
    },
  }
})

export const loading = $state({
  busy: false,
  error: undefined,
  forceHidden: false,

  start: function() {
    this.busy = true;
    this.error = undefined;
    this.forceHidden = false;
  },

  setError: function(e: any) {
    this.busy = false;
    this.error = e;
  },

  clear: function() {
    this.busy = false;
    this.error = undefined;
  }
});
