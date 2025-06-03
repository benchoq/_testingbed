<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

  import { 
    createCustomPreset,
    deleteCustomPreset 
  } from './viewlogic.svelte';
  import * as texts from './texts';
  import IconButton from '@/comps/IconButton.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  
  let nameInput = $state("untitle");
  let openNameDialog = $state(false);

  function onRenameClicked() {
    // deleteCustomPreset();
  }

  function onDeleteClicked() {
    deleteCustomPreset();
  }

  function onSaveClicked() {
    openNameDialog = true;
  }

  function onNameDialogAccepted() {
    createCustomPreset(nameInput);
  }
</script>

<div class="w-full flex flex-row justify-end mt-2 gap-2">
  <IconButton
    icon={EditOutline} flat tooltip={texts.wizard.buttons.rename}
    onClicked={onRenameClicked}
  ></IconButton>

  <IconButton
    icon={TrashBinOutline} flat tooltip={texts.wizard.buttons.delete}
    onClicked={onDeleteClicked}
  ></IconButton>

  <div class="grow"></div>

  <Button class="qt-button" on:click={onSaveClicked}>
    {texts.wizard.buttons.save}
  </Button>
</div>

<InputDialog
  bind:value={nameInput}
  bind:open={openNameDialog}
  onAccepted={onNameDialogAccepted}
/>
