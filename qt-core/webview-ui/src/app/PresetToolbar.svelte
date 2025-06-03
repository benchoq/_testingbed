<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { 
    PlusOutline,
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
  
  let nameInput = $state("untitle");
  let openNameDialog = $state(false);
  let openDeleteConfirm = $state(false);

  function onRenameClicked() {
    // deleteCustomPreset();
  }

  function onSaveClicked() {
    // openNameDialog = true;
  }

  function onCreateClicked() {
    openNameDialog = true;
  }

  function onNameDialogAccepted() {
    createCustomPreset(nameInput);
  }
</script>

<div class={`w-full flex flex-row justify-end gap-2 ${className}`}>
  <IconButton
    icon={TrashBinOutline} flat 
    visible={ui.toolbar.canDelete}
    tooltip={texts.wizard.buttons.delete}
    onClicked={() => { openDeleteConfirm = true; }}
  />

  <IconButton
    icon={EditOutline} flat 
    visible={ui.toolbar.canRename}
    tooltip={texts.wizard.buttons.rename}
    onClicked={onRenameClicked}
  />

  <div class="grow"></div>

  <Button class="qt-button"
    hidden={!ui.toolbar.canSave}
    on:click={onSaveClicked}
  >
    {texts.wizard.buttons.save}
  </Button>

  <IconButton
    icon={PlusOutline}
    text={texts.wizard.buttons.createCustomPreset}
    visible={ui.toolbar.canCreate}
    onClicked={onCreateClicked}
  />
</div>

<InputDialog
  bind:value={nameInput}
  bind:open={openNameDialog}
  onAccepted={onNameDialogAccepted}
/>

<ConfirmDialog
  bind:open={openDeleteConfirm}
  text={texts.wizard.confirmDeletePreset}
  onAccepted={deleteCustomPreset}
/>