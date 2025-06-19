<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { Input } from "flowbite-svelte";
  import type { PresetPromptStep } from "./types.svelte";

  let { 
    step, 
    enabled = true, 
    onValueChanged = (step: PresetPromptStep, value: any) => {}
  } = $props();

  let value = $state("")

  onMount(() => {value=step.default})
</script>

<Input
  type="text"
  class="qt-input w-full"
  disabled={!enabled}
  bind:value={value}
  on:input={() => { onValueChanged(step, value)}}
  />

