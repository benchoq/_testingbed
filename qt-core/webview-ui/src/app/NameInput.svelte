<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { configs, inputValidation } from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";
  import InputWithAlert from "@/comps/InputWithAlert.svelte";
</script>

<InputWithAlert
  bind:value={configs.name}
  onInput={viewlogic.dryRunGenerator}
  errors={inputValidation.nameError} />

