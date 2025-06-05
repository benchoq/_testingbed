<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { P } from 'flowbite-svelte';

  import StepInput from './StepInput.svelte';
  import StepPicker from './StepPicker.svelte';
  import StepConfirm from './StepConfirm.svelte';
  import { ui, preset } from './states.svelte';
  import type { PresetPromptStep } from './types.svelte';

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
  <div class="grid grid-cols-[1fr_max-content] gap-1">
    {#each preset.selection.steps as step (step.id)}
      <P class="qt-label">{step.question}</P>
      {#if step.type in stepComponents}
      {@const StepComp = stepComponents[step.type]}
        <div class="w-[120px]">
          <StepComp enabled={true} {step} {onValueChanged} />
        </div>
      {:else}
        <P class="qt-label">{step.default}</P>
      {/if}
    {/each}
  </div>
{/if}
