<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { 
    Label, Table, TableBody, TableBodyRow, TableBodyCell, Button
  } from "flowbite-svelte";

  import { presets } from "./states.svelte";
  import { type PromptData } from "./types.svelte";
  import SectionLabel from "@/comps/SectionLabel.svelte";

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

<SectionLabel text="Options" icon={false} class="mb-1" />

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

{#if (presets.selected && presets.selected.name.startsWith("@"))}
  <Button class="qt-button mt-3">
    Customize
  </Button>
{:else}
  <div></div>
{/if}

{/if}