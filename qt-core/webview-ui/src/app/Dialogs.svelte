<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { 
    renameCustomPreset,
    deleteCustomPreset,
    createCustomPreset,
  } from './viewlogic.svelte';
  import * as texts from './texts';
  import { data, ui } from './states.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import ConfirmDialog from '@/comps/ConfirmDialog.svelte';
  
  let presetNameRename = $state('');
  let presetNameCreate = $state("my_preset");
</script>

{#if ui.dialogs.inputRename}
  <InputDialog
    acceptOnEnter
    bind:open={ui.dialogs.inputRename}
    bind:value={presetNameRename}
    text={texts.wizard.enterNewPresetName}
    onReady={() => { presetNameRename = data.selected.preset?.name?? ''; }}
    onAccepted={() => { renameCustomPreset(presetNameRename); }}
  />
{/if}

{#if ui.dialogs.confirmDelete}
  <ConfirmDialog
    bind:open={ui.dialogs.confirmDelete}
    text={texts.wizard.confirmDeletePreset}
    onAccepted={deleteCustomPreset}
  />
{/if}

{#if ui.dialogs.inputCreate}
  <InputDialog
    acceptOnEnter
    bind:open={ui.dialogs.inputCreate}
    bind:value={presetNameCreate}
    text={texts.wizard.enterNewPresetName}
    onAccepted={() => { createCustomPreset(presetNameCreate); }}
  />
{/if}