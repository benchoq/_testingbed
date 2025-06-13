<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as texts from './texts';
  import { preset, ui } from './states.svelte';
  import { manageCustomPreset, validatePresetName } from './viewlogic.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import ConfirmDialog from '@/comps/ConfirmDialog.svelte';

  let input = $state({
    value: '',
    error: {
      level: '',
      message: undefined as string | undefined,
    },
  })

  function onInputChanged() {
    input.error.message = validatePresetName(input.value);
    input.error.level = (input.error.message !== undefined ? 'error' : '')
  }

  function onInputAccepted() {
    if (ui.activeDialog === 'create' || ui.activeDialog === 'rename') {
      manageCustomPreset({ 
        action: ui.activeDialog, 
        name: input.value.trim()
      });
    }

    closeDialogs();
  }

  function onInputDialongReady() {
    if (ui.activeDialog === 'create') {
      input.value = "mynewpreset";
    } else if (ui.activeDialog === 'rename') {
      input.value = preset.selection.name?? '';
    }
  }

  function closeDialogs() {
    ui.activeDialog = undefined;
  }
</script>

{#if ui.activeDialog === 'create' || ui.activeDialog === 'rename' }
  <InputDialog
    acceptOnEnter
    bind:value={input.value}
    level={input.error.level}
    message={input.error.message}
    text={texts.wizard.enterNewPresetName}
    onReady={onInputDialongReady}
    onInput={onInputChanged}
    onAccepted={onInputAccepted}
    onRejected={closeDialogs}
  />
{/if}

{#if ui.activeDialog === 'delete' }
  <ConfirmDialog
    text={texts.wizard.confirmDeletePreset}
    onAccepted={() => {
      closeDialogs();
      manageCustomPreset({ action: 'delete' });
    }}
    onRejected={closeDialogs}
  />
{/if}
