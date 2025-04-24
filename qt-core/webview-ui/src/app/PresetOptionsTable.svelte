<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { 
    Label,
    Table, TableBody, TableBodyRow, TableBodyCell
  } from "flowbite-svelte";

  import { presets } from "./states.svelte";
  
  const steps = presets.selectedPrompt?.prompt.steps;
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

<Table color="custom" class="qt-simple-table">
  <TableBody tableBodyClass="divide-y">
    {#each steps as step}
    <TableBodyRow>
      <TableBodyCell class="p-0.5">
        <Label class="qt-label">{step.question}</Label>
      </TableBodyCell>
      <TableBodyCell class="p-0.5">
        <Label class="qt-label">{toDisplayValue(step.default)}</Label>
      </TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>

{/if}