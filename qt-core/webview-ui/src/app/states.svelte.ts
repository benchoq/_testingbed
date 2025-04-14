// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

import _ from "lodash";
import { type PresetInfo } from "./types.svelte";

export const presets = $state<PresetInfo>({
  all: [],
  selected: undefined,
  selectedIndex: -1,
  selectedPrompt: undefined,
});

export const configs = $state({
  type: "file",
  name: "",
  workingDir: "",
  saveWorkingDir: false,
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
