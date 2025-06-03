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

  import { 
    createCustomPreset,
    deleteCustomPreset 
  } from './viewlogic.svelte';
  import * as texts from './texts';
  import { ui } from './states.svelte';
  import IconButton from '@/comps/IconButton.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import ConfirmDialog from '@/comps/ConfirmDialog.svelte';

  let {
    class: className = ''
  } = $props();
  
  let openDeleteConfirm = $state(false);
</script>

<div class={`w-full flex flex-row justify-end gap-2 ${className}`}>
  <IconButton
    icon={TrashBinOutline} flat 
    visible={ui.preset.canDelete}
    tooltip={texts.wizard.buttons.delete}
    onClicked={() => { openDeleteConfirm = true; }}
  />

  <IconButton
    icon={EditOutline} flat 
    visible={ui.preset.canRename}
    tooltip={texts.wizard.buttons.rename}
  />
  <div class="grow"></div>

  <Button class="qt-button flat" hidden={!ui.preset.canSave}>
    {texts.wizard.buttons.save}
  </Button>
</div>

<!-- dialogs -->
<!-- {#if openCreateDialog}
  <InputDialog
    acceptOnEnter
    bind:open={openCreateDialog}
    bind:value={newPresetName}
    text={texts.wizard.enterNewPresetName}
    onAccepted={() => { createCustomPreset(newPresetName); }}
  />
{/if} -->

{#if openDeleteConfirm}
  <ConfirmDialog
    bind:open={openDeleteConfirm}
    text={texts.wizard.confirmDeletePreset}
    onAccepted={deleteCustomPreset}
  />
{/if}
