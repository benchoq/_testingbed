<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { FolderOpenOutline } from "flowbite-svelte-icons";
  import { configs, inputValidationResult } from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";
  import InputWithValidation from "@/comps/InputWithValidation.svelte";
</script>

<div class="w-full grid grid-cols-[min-content_1fr] gap-0">
  <Button
    class="qt-button px-2 py-0 rounded-r-none! z-1"
    title="Browse"
    on:click={viewlogic.changeWorkingDir}
    ><FolderOpenOutline />
  </Button>
  
  <InputWithValidation 
    bind:value={configs.workingDir}
    onInput={viewlogic.validateInputs}
    errors={inputValidationResult.workingDirError} />
  <!-- class={`qt-input -ml-px rounded-l-none! ${workingDirInputHasFocus || workingDirHasError ? "z-10" : "z-0"}`} -->
</div>
