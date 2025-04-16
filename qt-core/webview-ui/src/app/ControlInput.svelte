<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button, Checkbox } from "flowbite-svelte";
  import { ArrowRightOutline } from "flowbite-svelte-icons";
  import { configs } from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";

  let nameHasError = $state(false);
  let workingDirHasError = $state(false);
  let isDisabled = $derived(nameHasError || workingDirHasError);

</script>

<div class="col-start-2 grid grid-cols-[1fr_min-content]">
  {#if configs.type === "project"}
    <Checkbox
      class="self-start qt-checkbox"
      bind:checked={configs.saveWorkingDir}
      on:change={(e) => {
        viewlogic.uploadSaveWorkDir((e.target as HTMLInputElement).checked);
      }}
    >
      Use as a default project directory
    </Checkbox>
  {:else}
    <div></div>
  {/if}
  <Button
    class="qt-button"
    disabled={isDisabled}
    on:click={viewlogic.createItemFromSelectedPreset}
  >
    <ArrowRightOutline class="mr-3" />Create
  </Button>
</div>
