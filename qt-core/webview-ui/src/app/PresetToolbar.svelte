<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { 
    EditOutline, 
    TrashBinOutline
   } from 'flowbite-svelte-icons';

  import { updateCustomPreset } from './viewlogic.svelte';
  import * as texts from './texts';
  import { data, ui } from './states.svelte';
  import IconButton from '@/comps/IconButton.svelte';

  let {
    class: className = ''
  } = $props();
  
  let saveEnabled = $derived.by(() => {
    return ui.preset.canSave && (Object.keys(data.selected.unsavedOptionChanges).length !== 0);
  });

</script>

<div class={`w-full flex flex-row justify-end gap-2 ${className}`}>
  <IconButton
    icon={TrashBinOutline} flat 
    visible={ui.preset.canDelete}
    tooltip={texts.wizard.buttons.delete}
    onClicked={() => { ui.dialogs.confirmDelete = true; }}
  />

  <IconButton
    icon={EditOutline} flat
    visible={ui.preset.canRename}
    tooltip={texts.wizard.buttons.rename}
    onClicked={() => { ui.dialogs.inputRename = true; }}
  />
  <div class="grow"></div>

  <Button
    class={`
      qt-button py-1
      transition-opacity duration-200
      ${!saveEnabled ? 'opacity-0 pointer-events-none' : ''}
    `}
    on:click={updateCustomPreset}
  >
    {texts.wizard.buttons.update}
  </Button>
</div>
