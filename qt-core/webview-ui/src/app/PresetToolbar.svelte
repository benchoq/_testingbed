<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Button } from 'flowbite-svelte';
  import { 
    EditOutline, 
    TrashBinOutline
   } from 'flowbite-svelte-icons';

  import { 
    updateCustomPreset,
    renameCustomPreset,
    deleteCustomPreset,
  } from './viewlogic.svelte';
  import * as texts from './texts';
  import { data, ui } from './states.svelte';
  import IconButton from '@/comps/IconButton.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import ConfirmDialog from '@/comps/ConfirmDialog.svelte';

  let {
    class: className = ''
  } = $props();
  
  let openRenameDialog = $state(false);
  let openDeleteConfirm = $state(false);
  let newPresetName = $state('');
</script>

<div class={`w-full flex flex-row justify-end gap-2 ${className}`}>
  <IconButton
    icon={TrashBinOutline} flat 
    class="px-3 py-2"
    visible={ui.preset.canDelete}
    tooltip={texts.wizard.buttons.delete}
    onClicked={() => { openDeleteConfirm = true; }}
  />

  <IconButton
    icon={EditOutline} flat
    class="px-3 py-2"
    visible={ui.preset.canRename}
    tooltip={texts.wizard.buttons.rename}
    onClicked={() => { openRenameDialog = true; }}
  />
  <div class="grow"></div>

  {#if ui.preset.canSave && (Object.keys(data.selected.optionChanges).length !== 0)}
    <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
      <Button
        class="qt-button py-2"
        on:click={updateCustomPreset}
      >
        {texts.wizard.buttons.update}
      </Button>
    </div>
  {/if}
</div>

<!-- dialogs -->
{#if openRenameDialog}
  <InputDialog
    acceptOnEnter
    bind:open={openRenameDialog}
    bind:value={newPresetName}
    text={texts.wizard.enterNewPresetName}
    onReady={() => { newPresetName = data.selected.preset?.name?? ''; }}
    onAccepted={() => { renameCustomPreset(newPresetName); }}
  />
{/if}

{#if openDeleteConfirm}
  <ConfirmDialog
    bind:open={openDeleteConfirm}
    text={texts.wizard.confirmDeletePreset}
    onAccepted={deleteCustomPreset}
  />
{/if}
