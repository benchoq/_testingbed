<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Checkbox, Label } from "flowbite-svelte";

  import LoadingMask from "@/comps/LoadingMask.svelte";
  import SectionLabel from "@/comps/SectionLabel.svelte";
  import PresetList from "./PresetList.svelte";
  import PresetTypeSelector from "./PresetTypeSelector.svelte";
  import PresetOptionsTable from "./PresetOptionsTable.svelte";
  import * as states from "./states.svelte";
</script>

<div class={`
  w-full h-full grid gap-2
  grid-rows-[min-content_1fr] 
  grid-cols-[min-content_minmax(300px,1fr)_1fr]
  `}>
  <SectionLabel text="Select preset" class="w-full col-span-3" />
  <PresetTypeSelector />
  <PresetList />
  <div class="flex flex-col">
    <SectionLabel text="Description" icon={false} />
    <div>
      <Label class="qt-label whitespace-pre-wrap leading-relaxed"
        >{(states.presets.selected?.meta?.description ?? "").replaceAll("\n", "\n\n")}
      </Label>
    </div>
    <div class="flex-grow"></div>
    <SectionLabel text="Options" icon={false} />
    <PresetOptionsTable />
    <Checkbox class="qt-checkbox mt-2 justify-end">Customize</Checkbox>
  </div>    
</div>
<LoadingMask {...states.loading} />
