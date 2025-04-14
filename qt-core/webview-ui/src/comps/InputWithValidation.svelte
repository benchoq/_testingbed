<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { Input, Button, Alert } from "flowbite-svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { Validator } from "@/logic/inputValidator";

  let { 
    value = $bindable(""),
    rules,
    errorMessageBuilder = undefined,
    class: className = "",
    classInput = "",
    hasError = $bindable(false),
    hasFocus = $bindable(false),
    ...restProps
  } = $props();

  let hovered = $state(false);
  let hideAlert = $state(true);
  let error: string[] | undefined = $state(undefined);
  const validator = new Validator(rules);

  if (errorMessageBuilder) {
    validator.setErrorMessageBuilder(errorMessageBuilder);
  }

  async function runValidator() {
    // console.log("---->", value);
    const result = await validator.run(value);
    hasError = !result.passed;
    // console.log("---", value, ":", result.failedResults);
    error = result.failedResults?.map((r) => { return r.error });
  }

  onMount(runValidator);
</script>

<div class={`relative ${className}`}>
  {#if error && (!hideAlert || hovered)}
    <Alert border
      color="none"
      class="absolute w-full bottom-full -mb-0.5 qt-alert"
    >
      {error}
    </Alert>
  {/if}

  <Input
    id="input_name"
    type="text"
    required
    class={`qt-input ${error ? 'error' : ''} ${classInput}`}
    bind:value={value}
    onblur={() => { hasFocus = false; hideAlert = true; }}
    oninput={() => { runValidator(); hideAlert = false; }}
    onfocus={e => { 
      (e.target as HTMLInputElement).select();
      hasFocus = true;
      hideAlert = false;
    }}
    {...restProps}
  >
    <Button slot="right"
      class={`qt-input-icon error ${!error ? "hidden" : ""}`}
      title="Toggle alert"
      on:mouseenter={() => { hovered = true }}
      on:mouseleave={() => { hovered = false }}
      ><InfoCircleSolid />
    </Button>
  </Input>
</div>