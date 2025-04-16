<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import {
    RuleId,
    type Rule,
    type RuleCheckResult,
  } from "@/logic/inputValidator";
  import InputWithValidation from "@/comps/InputWithValidation.svelte";
  import { configs } from "./states.svelte";

  let nameHasError = $state(false);

  const nameRules: Rule[] = [
    { id: RuleId.NotEmpty },
    { id: RuleId.MinLength, param: 4 },
    { id: RuleId.MaxLength, param: 20 },
    { id: RuleId.RegexMatch, param: "^[A-Za-z0-9]*$" },
  ];

  function errorMessageBuilder(r: RuleCheckResult): string | undefined {
    if (r.id === RuleId.NotEmpty) {
      return "Name cannot be empty.";
    }

    return undefined;
  }
</script>

<InputWithValidation
  id="input_name"
  rules={nameRules}
  {errorMessageBuilder}
  bind:value={configs.name}
  bind:hasError={nameHasError}
/>

