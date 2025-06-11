<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import _ from 'lodash';

  import { type PresetPromptStep } from './types.svelte';
  import Picker from '@/comps/Picker.svelte';

  let {
    step = undefined as PresetPromptStep | undefined,
    onValueChanged = (step: PresetPromptStep, value: any) => {}
  } = $props();

  let defaultText = $derived(step?.default ?? '');
  let itemTexts = $derived.by(() => {
    if (!step?.items) {
      return [];
    }

    return step.items.map((e) => {
      return e.text;
    });
  });

  function onSelected(i: number) {
    onValueChanged(step, itemTexts[i])
  }
</script>

<Picker 
  {itemTexts} 
  {defaultText}
  {onSelected}
/>
