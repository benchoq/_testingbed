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

  function onInputChanged() {
    input.error.message = validatePresetName(input.value);
    input.error.level = (input.error.message !== undefined ? 'error' : '')
  }

  function onInputAccepted() {
    if (ui.activeDialog.input === 'create') {
      createCustomPreset(input.value)
    } else if (ui.activeDialog.input === 'rename') {
      renameCustomPreset(input.value);
    } else if (ui.activeDialog.input === 'duplicate') {
      createCustomPreset(input.value);
    }

    closeDialogs();
  }

  function onInputDialongReady() {
    if (ui.activeDialog.input === 'create') {
      input.value = "mynewpreset";
    } else if (ui.activeDialog.input === 'rename') {
      input.value = preset.selection.name?? '';
    } else if (ui.activeDialog.input === 'duplicate') {
      input.value = preset.selection.name
        ? preset.selection.name + '_copy' : '';
    }
  }

  function closeDialogs() {
    ui.activeDialog.input = undefined;
    ui.activeDialog.confirm = undefined;
  }
</script>

{#if ui.activeDialog.input}
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

{#if ui.activeDialog.confirm}
  <ConfirmDialog
    text={texts.wizard.confirmDeletePreset}
    onAccepted={() => {
      closeDialogs();
      deleteCustomPreset();
    }}
    onRejected={closeDialogs}
  />
{/if}
