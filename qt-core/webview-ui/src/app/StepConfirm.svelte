<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { Checkbox } from "flowbite-svelte";
  import type { PresetPromptStep } from "./types.svelte";

  let { 
    step, 
    enabled = true, 
    onValueChanged = (step: PresetPromptStep, value: any) => {}
  } = $props();
  let checked = $state(false)

  onMount(() => {checked=step.default})
</script>

<Checkbox
  class="qt-checkbox"
  disabled={!enabled}
  bind:checked={checked}
  on:change={() => { onValueChanged(step, checked) }}
>
Yes
</Checkbox>
