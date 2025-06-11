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
  
  let input = $state({
    value: '',
    error: {
      level: '',
      message: undefined as string | undefined,
    },
  })
</script>

{#if ui.dialogs.input}
  <InputDialog
    acceptOnEnter
    bind:value={input.value}
    level={input.error.level}
    message={input.error.message}
    text={texts.wizard.enterNewPresetName}
    onReady={() => {
      const p = ui.dialogs.input;
      if (p === 'rename') {
        input.value = preset.selection.name?? ''; 
      } else if (p === 'create') {
        input.value = "mynewpreset";
      }
    }}
    onInput={() => {
      input.error.message = validatePresetName(input.value);
      input.error.level = (input.error.message !== undefined ? 'error' : '')
    }}
    onAccepted={() => {
      const p = ui.dialogs.input;
      if (p === 'rename') {
        renameCustomPreset(input.value); 
      } else if (p === 'create') {
        createCustomPreset(input.value)
      }
      
      ui.dialogs.input = undefined;
    }}
    onRejected={() => { ui.dialogs.input = undefined; }}
  />
{/if}

{#if ui.dialogs.confirm}
  <ConfirmDialog
    text={texts.wizard.confirmDeletePreset}
    onAccepted={() => {
      ui.dialogs.confirm = undefined;
      deleteCustomPreset();
    }}
    onRejected={() => { ui.dialogs.confirm = undefined; }}
  />
{/if}
