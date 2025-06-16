<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { P } from 'flowbite-svelte';
  import { PlusOutline, FloppyDiskOutline } from 'flowbite-svelte-icons';

  import * as texts from './texts';
  import { ui, preset } from './states.svelte';
  import type { PresetPromptStep } from './types.svelte';
  import { manageCustomPreset } from './viewlogic.svelte';

  import IconButton from '@/comps/IconButton.svelte';
  import SectionLabel from '@/comps/SectionLabel.svelte';
  import StepInput from './StepInput.svelte';
  import StepPicker from './StepPicker.svelte';
  import StepConfirm from './StepConfirm.svelte';

  let createEnabled = $derived.by(() => {
    return (
      preset.selection.isDefaultPreset() &&
      preset.selection.hasSteps() &&
      Object.keys(ui.unsavedOptionChanges).length !== 0
    );
  });

  let saveEnabled = $derived.by(() => {
    return (
      preset.selection.isCustomPreset() &&
      Object.keys(ui.unsavedOptionChanges).length !== 0
    );
  });

  const stepComponents: Record<string, any> = {
    input: StepInput,
    picker: StepPicker,
    confirm: StepConfirm
  };

  function onValueChanged(step: PresetPromptStep, value: any) {
    ui.unsavedOptionChanges[step.id] = value;
  }
</script>

{#if preset.selection.steps}
  <div>
    <!-- title and toolbar -->
    <div class="w-full flex items-end justify-between mb-2">
      <div>
        <SectionLabel text={texts.wizard.options} />
      </div>
      <div
        class={`
          flex flex-row transition-opacity duration-200
          ${!(createEnabled || saveEnabled) ? 'opacity-0 pointer-events-none' : ''}
          `}
      >
        <IconButton
          icon={PlusOutline}
          tooltip={texts.wizard.buttons.saveAsTooltip}
          tooltipPlacement="top-end"
          visible={createEnabled}
          onClicked={() => { ui.activeDialog = 'create'; }}
        />

        <IconButton
          icon={FloppyDiskOutline}
          visible={saveEnabled}
          text={texts.wizard.buttons.update}
          class='px-4 py-2'
          onClicked={() => { manageCustomPreset({ action: 'update' }); }}
        />
      </div>
    </div>

    <!-- table -->
    <div class="grid grid-cols-[1fr_max-content] gap-1">
      {#each preset.selection.steps as step (step.id)}
        <P class="qt-label">{step.question}</P>
        {#if step.type in stepComponents}
          {@const StepComp = stepComponents[step.type]}
          <div class="flex item-center min-w-[120px]">
            <StepComp enabled={true} {step} {onValueChanged} />
          </div>
        {:else}
          <P class="qt-label">{step.default}</P>
        {/if}
      {/each}
    </div>
  </div>
{/if}
