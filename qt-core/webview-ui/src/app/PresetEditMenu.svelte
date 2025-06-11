<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Dropdown } from 'flowbite-svelte';
  import {
    EditOutline,
    TrashBinOutline,
    FileCloneOutline
  } from 'flowbite-svelte-icons';

  import * as texts from './texts';
  import { ui } from './states.svelte';
  import IconButton from '@/comps/IconButton.svelte';

  let { class: className = '' } = $props();
  let open = $state(false);

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

<Dropdown bind:open
  class="flex flex-col m-0 p-1" 
  placement="bottom-start"
  offset={2}
>
  <div class={`flex flex-col ${className}`}>
    {#each items as item, index (index)}
      <IconButton flat borderless
        icon={item.icon}
        text={item.text}
        class={"p-2"}
        onClicked={() => { onItemClickedAt(index); }}
      />
    {/each}
  </div>
</Dropdown>
