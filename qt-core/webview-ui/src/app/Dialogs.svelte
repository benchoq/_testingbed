<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { 
    renameCustomPreset,
    deleteCustomPreset,
    createCustomPreset,
    validatePresetName
  } from './viewlogic.svelte';
  import * as texts from './texts';
  import { preset, ui } from './states.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import ConfirmDialog from '@/comps/ConfirmDialog.svelte';
  
  let rename = $state({
    value: '',
    errorMessage: undefined as string | undefined,
  })

  let presetNameCreate = $state("my_preset");
</script>

{#if ui.dialogs.renameInput}
  <InputDialog
    acceptOnEnter
    bind:open={ui.dialogs.renameInput}
    bind:value={rename.value}
    message={rename.errorMessage}
    level={rename.errorMessage !== undefined ? 'error' : ''}
    text={texts.wizard.enterNewPresetName}
    onReady={() => { rename.value = preset.selection.name?? ''; }}
    onInput={() => {
      rename.errorMessage = validatePresetName(rename.value);
    }}
    onAccepted={() => { renameCustomPreset(rename.value); }}
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