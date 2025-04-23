<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { configs, inputValidationResult } from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";
  import InputWithValidation from "@/comps/InputWithValidation.svelte";
</script>

<InputWithValidation
  bind:value={configs.name}
  onInput={viewlogic.validateInputs}
  errors={inputValidationResult.nameError}
/>

