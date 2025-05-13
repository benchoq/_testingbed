<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Input, Button, Alert } from "flowbite-svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

  let {
    value = $bindable(""),
    focusOnMount = false,
    onInput,
    errors = undefined,
    ...restProps
  } = $props();

  const hasError = $derived(errors && (errors.length > 0));
  let hovered = $state(false);
  let focused = $state(false);

  onMount(() => {
    if (focusOnMount) {
      setTimeout(() => {
        const el = document.getElementById("input_name") as HTMLInputElement | null;
        el?.focus();
      }, 0);
    }
  })

</script>

<div class='relative'>
  {#if hasError && (focused || hovered)}
    <Alert
      border
      color="none"
      class="absolute w-full bottom-full -mb-0.5 qt-alert"
    >
      {errors}
    </Alert>
  {/if}

  <Input
    id="input_name"
    type="text"
    required
    class={`qt-input ${hasError ? "error" : ""}`}
    bind:value
    onblur={() => { focused = false }}
    oninput={onInput}
    onfocus={e => { 
      (e.target as HTMLInputElement).select();
      focused = true;
    }}
    {...restProps}
  >
    <Button
      slot="right"
      class={`qt-input-icon error ${!hasError ? "hidden" : ""}`}
      title="Toggle alert"
      on:mouseenter={() => { hovered = true; }}
      on:mouseleave={() => { hovered = false; }}
    >
      <InfoCircleSolid />
    </Button>
  </Input>
</div>
