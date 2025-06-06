<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Dropdown } from 'flowbite-svelte';
  import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

  import * as texts from './texts';
  import { preset, ui } from './states.svelte';
  import IconButton from '@/comps/IconButton.svelte';

  let { class: className = '' } = $props();
</script>

<Dropdown class="p-3 flex flex-col gap-2" placement="right-start">
  <li class="flex flex-row">
    <TrashBinOutline />Delete
  </li>
  <li class="flex flex-row">
    <EditOutline />Rename
  </li>
  <li class="flex flex-row">
    <TrashBinOutline />Duplicate
  </li>
</Dropdown>
<!-- 
<div class={`flex flex-row justify-end gap-2 ${className}`}>
  <IconButton
    icon={TrashBinOutline} flat 
    visible={preset.selection.isCustomPreset()}
    tooltip={texts.wizard.buttons.delete}
    onClicked={() => { ui.dialogs.deleteConfirm = true; }}
  />

  <IconButton
    icon={EditOutline} flat
    visible={preset.selection.isCustomPreset()}
    tooltip={texts.wizard.buttons.rename}
    onClicked={() => { ui.dialogs.renameInput = true; }}
  />
</div> -->
