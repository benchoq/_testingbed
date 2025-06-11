<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import _ from 'lodash';
  import { FileCloneOutline } from 'flowbite-svelte-icons';

  import { type PresetPromptStep } from './types.svelte';
  import Picker from '@/comps/Picker.svelte';

  let {
    step = undefined as PresetPromptStep | undefined,
    onValueChanged = (step: PresetPromptStep, value: any) => {}
  } = $props();

  let defaultText = $derived(step?.default ?? '');
  let items = $derived.by(() => {
    if (!step?.items) {
      return [] as { text: string, icon: (typeof FileCloneOutline | undefined) }[];
    }

    return step.items.map((e) => {
      return { text: e.text, icon: undefined }
    });
  });

  function onSelected(i: number) {
    onValueChanged(step, items[i].text)
  }
</script>

<Picker 
  {items}
  {defaultText}
  {onSelected}
  showIcon={false}
/>
