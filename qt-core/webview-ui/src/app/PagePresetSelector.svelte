<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Label } from "flowbite-svelte";

  import LoadingMask from "@/comps/LoadingMask.svelte";
  import SectionLabel from "@/comps/SectionLabel.svelte";
  import PresetList from "./PresetList.svelte";
  import PresetTypeSelector from "./PresetTypeSelector.svelte";
  import PresetOptionsTable from "./PresetOptionsTable.svelte";
  import { presets, loading } from "./states.svelte";
</script>

<div class={`
  w-full h-full grid gap-x-3 gap-y-2
  grid-rows-[min-content_1fr] 
  grid-cols-[min-content_minmax(300px,1fr)_1fr]
  `}>
  <SectionLabel text="Available presets" class="w-full col-span-3" />
  <PresetTypeSelector />
  <PresetList />
  <div class="flex flex-col">
    <SectionLabel text="Description" />
    <div>
      <Label class="qt-label whitespace-pre-wrap leading-relaxed"
        >{(presets.selected?.meta?.description ?? "").replaceAll("\n", "\n\n")}
      </Label>
    </div>
    <div class="flex-grow"></div>

    {#if presets.selectedPrompt?.prompt.steps }
      <SectionLabel text="Options" />
      <PresetOptionsTable />
    {/if}
  </div>
</div>
<LoadingMask {...loading} />
