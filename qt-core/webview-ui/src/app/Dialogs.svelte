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
  import { preset, ui } from './states.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import ConfirmDialog from '@/comps/ConfirmDialog.svelte';
  
  let presetNameRename = $state('');
  let presetNameCreate = $state("my_preset");
</script>

{#if ui.dialogs.renameInput}
  <InputDialog
    acceptOnEnter
    bind:open={ui.dialogs.renameInput}
    bind:value={presetNameRename}
    text={texts.wizard.enterNewPresetName}
    onReady={() => { presetNameRename = preset.selection.name?? ''; }}
    onAccepted={() => { renameCustomPreset(presetNameRename); }}
  />
{/if}

{#if ui.dialogs.deleteConfirm}
  <ConfirmDialog
    bind:open={ui.dialogs.deleteConfirm}
    text={texts.wizard.confirmDeletePreset}
    onAccepted={deleteCustomPreset}
  />
{/if}

{#if ui.dialogs.createInput}
  <InputDialog
    acceptOnEnter
    bind:open={ui.dialogs.createInput}
    bind:value={presetNameCreate}
    text={texts.wizard.enterNewPresetName}
    onAccepted={() => { createCustomPreset(presetNameCreate); }}
  />
{/if}