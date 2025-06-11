<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import {
    EditOutline,
    TrashBinOutline,
    FileCloneOutline
  } from 'flowbite-svelte-icons';

  import * as texts from './texts';
  import { ui } from './states.svelte';
  import PickerList from '@/comps/PickerList.svelte';

  let { 
    open = $bindable(false)
   } = $props();

  const items = [
    { icon: TrashBinOutline, text: texts.wizard.buttons.delete },
    { icon: EditOutline, text: texts.wizard.buttons.rename },
    { icon: FileCloneOutline, text: texts.wizard.buttons.duplicate }
  ];

  function onItemClickedAt(index: number) {
    open = false;

    if (index === 0) {
      ui.activeDialog.confirm = 'delete';
    } else if (index === 1) {
      ui.activeDialog.input = 'rename';
    } else if (index === 2) {
      ui.activeDialog.input = 'duplicate';
    }
  }
</script>

<PickerList
  bind:open
  {items}
  width={100}
  offset={10}
  onAccepted={onItemClickedAt}
/>
