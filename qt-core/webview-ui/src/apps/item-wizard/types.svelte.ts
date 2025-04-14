// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 

export interface Preset {
  id: string,
  name: string,
  meta: {
    title: string,
    description: string
  }
}

export interface PromptStepData {
  id: string;
  type: string;
  question: string;
  default: any;
  items: any[];
  when: string;
  rules: object[];
}

export interface PromptData {
  name: string;
  prompt: {
    version: string;
    steps: PromptStepData[];
    consts: object[];
  };
}

export interface PresetInfo {
  all: Preset[],
  selected: Preset | undefined,
  selectedIndex: number,
  selectedPrompt: PromptData | undefined,
}
