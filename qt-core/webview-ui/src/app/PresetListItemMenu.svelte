<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

  import * as texts from './texts';
  import { ui } from './states.svelte';
  import PickerList from '@/comps/PickerList.svelte';

  let { 
    open = false,
    onClosed = () => {}
  } = $props();

  const items = [
    { icon: TrashBinOutline, text: texts.wizard.buttons.delete },
    { icon: EditOutline, text: texts.wizard.buttons.rename }
  ];

  function onItemClickedAt(index: number) {
    if (index === 0) {
      ui.activeDialog = 'delete';
    } else if (index === 1) {
      ui.activeDialog = 'rename';
    }

    open = false;
    onClosed();
  }
</script>

{#if open}
  <PickerList
    active={true}
    {items}
    width={100}
    offset={12}
    currentIndex=-1
    onRejected={onClosed}
    onAccepted={onItemClickedAt}
  />
{/if}
