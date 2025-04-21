<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { inputValidationResult } from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";
  import InputWithValidation from "@/comps/InputWithValidation.svelte";

  let name = $state('');
</script>

<InputWithValidation
  bind:value={name}
  onInput={() => { viewlogic.setName(name) }}
  errors={inputValidationResult.nameError}
/>

