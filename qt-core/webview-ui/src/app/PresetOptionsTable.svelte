<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { P, Button } from 'flowbite-svelte';

  import StepInput from './StepInput.svelte';
  import StepPicker from './StepPicker.svelte';
  import StepConfirm from './StepConfirm.svelte';
  import { data } from './states.svelte';
  import { saveOptions } from './viewlogic.svelte';
  import type { PresetPromptStep } from './types.svelte';

  const stepComponents: Record<string, any> = {
    input: StepInput,
    picker: StepPicker,
    confirm: StepConfirm
  };

  const steps = $derived(data.selected.preset?.prompt?.steps);
  function onValueChanged(step: PresetPromptStep, value: any) {
    data.selected.optionChanges[step.id] = value;
  }
</script>

{#if steps}
  <div class="grid grid-cols-2 gap-1">
    {#each steps as step (step.id)}
      <P class="qt-label">{step.question}</P>
      {#if step.type in stepComponents}
        {@const StepComp = stepComponents[step.type]}
        <StepComp enabled={true} {step} {onValueChanged} />
      {/if}
    {/each}
  </div>
  <div class="w-full flex flex-row justify-end mt-2 bg-blue-400">
    <Button class="qt-button z-200" 
      on:click={saveOptions}>Save</Button>
  </div>
{/if}
