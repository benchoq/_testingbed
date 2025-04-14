<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { 
    Label, Table, TableBody, TableBodyRow, TableBodyCell 
  } from "flowbite-svelte";
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

  import { presets } from "./states.svelte";
  import { type PromptData } from "./types.svelte";

  let steps = $derived.by(() => {
    if (presets.selectedPrompt) {
      const v = $state.snapshot(presets.selectedPrompt);
      return (v as PromptData).prompt.steps;
    }

    return undefined;
  });

  const toDisplayValue = (value: any) => {
    if (typeof value === 'string' && value.length === 0) {
      return "-";
    } else if (typeof value === 'boolean') {
      return value ? "Yes" : "No";
    }

    return value;
  }
</script>

{#if steps}

<div class="flex flex-row gap-1 align-center mb-1">
  <ChevronDownOutline class="qt-label-highlight" />
  <Label class="qt-label-highlight">Options</Label>
</div>

<Table color="custom" class="qt-simple-table">
    <TableBody tableBodyClass="divide-y">
      {#each steps as step}
      <TableBodyRow>
        <TableBodyCell class="p-0">
          <Label class="qt-label">{step.question}</Label>
        </TableBodyCell>
        <TableBodyCell class="p-0">
          <Label class="qt-label">{toDisplayValue(step.default)}</Label>
        </TableBodyCell>
      </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{/if}
