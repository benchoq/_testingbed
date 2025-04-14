<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Input, Label, Button, Checkbox } from "flowbite-svelte";
  import { 
    FolderOpenOutline, 
    ChevronRightOutline,
    ArrowRightOutline,
  } from "flowbite-svelte-icons";
  import { RuleId, type Rule, type RuleCheckResult } from "@/logic/inputValidator";
  import InputWithValidation from "@/comps/InputWithValidation.svelte";
  import { configs } from "./states.svelte";
  import * as logic from "./viewlogic.svelte";

  let nameHasError = $state(false);
  let workingDirHasError = $state(false);
  let workingDirInputHasFocus = $state(false);
  let isDisabled = $derived(nameHasError || workingDirHasError);

  const nameRules: Rule[] = [
    { id: RuleId.NotEmpty },
    { id: RuleId.MinLength, param: 4 },
    { id: RuleId.MaxLength, param: 20 },
    { id: RuleId.RegexMatch, param: '^[A-Za-z0-9]*$' },
  ]

  const workingDirRules: Rule[] = [
    { id: RuleId.NotEmpty },
    { id: RuleId.DirectoryExists, param: () => { return configs.workingDir; }}
  ]

  function errorMessageBuilder(r: RuleCheckResult): string | undefined {
    if (r.id === RuleId.NotEmpty) {
      return `${configs.type} must not be empty.`
    }

    return undefined;
  }

</script>

<div class={`
  grid 
  grid-cols-[max-content_1fr] 
  grid-rows-[auto_auto_1fr_auto] 
  gap-x-4 gap-y-2 h-full`}>

  <!-- name -->
  <div class="flex flex-row self-center">
    <ChevronRightOutline class="qt-label-highlight" />
    <Label for="input_name" class="qt-label-highlight">Name</Label>
  </div>
  <InputWithValidation 
    id="input_name" 
    rules={nameRules}
    {errorMessageBuilder}
    bind:value={configs.name} 
    bind:hasError={nameHasError} />

  <!-- working directory -->
  <div class="flex flex-row self-center">
    <ChevronRightOutline class="qt-label-highlight" />
    <Label for="input_working_dir" class="qt-label-highlight">Create In</Label>
  </div>
  <div class="w-full grid grid-cols-[min-content_1fr] gap-0">
    <Button
      class="qt-button px-2 py-0 rounded-r-none! z-1"
      title="Browse"
      on:click={logic.changeWorkingDir}
      ><FolderOpenOutline />
    </Button>
    <InputWithValidation
      id="input_working_dir"
      rules={workingDirRules}
      bind:value={configs.workingDir} />
      <!-- class={`qt-input -ml-px rounded-l-none! ${workingDirInputHasFocus || workingDirHasError ? "z-10" : "z-0"}`} -->

  </div>

  <!-- option and [create] -->
  <div class="col-start-2 grid grid-cols-[1fr_min-content]">
    {#if configs.type === "project"}
      <Checkbox class="self-start qt-checkbox" 
        bind:checked={configs.saveWorkingDir}
        on:change={(e) => { 
          logic.uploadSaveWorkDir((e.target as HTMLInputElement).checked);
        }}>
        Use as a default project directory
      </Checkbox>
    {:else}
      <div></div>
    {/if}
    <Button
      class="qt-button" 
      disabled={isDisabled} 
      on:click={logic.createItemFromSelectedPreset}
    >
      <ArrowRightOutline class="mr-3"/>Create
    </Button>
  </div>
</div>
