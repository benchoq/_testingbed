<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Checkbox } from "flowbite-svelte";

  import SectionLabel from "@/comps/SectionLabel.svelte";
  import NameInput from "./NameInput.svelte";
  import WorkingDirInput from "./WorkingDirInput.svelte";
  import PresetOptionsTable from "./PresetOptionsTable.svelte";
  import { presets, configs } from "./states.svelte";
  import { createPresetDisplayText } from "./viewlogic.svelte";
</script>

<div class={`w-full h-full grid
  grid-cols-[max-content_1fr]
  grid-rows-[min-content_1fr_repeat(3,min-content)]
  gap-2`}
>
  <SectionLabel text="Preset" />
  <div>{createPresetDisplayText(presets.selected)}</div>

  <div></div>
  <div class="w-1/2">
    <PresetOptionsTable />
  </div>

  <SectionLabel text="Name" /><NameInput />
  <SectionLabel text="Create In" class="h-full"/>
  <div>
    <WorkingDirInput />
    {#if configs.type === "project"}
      <Checkbox
        class="self-start qt-checkbox mt-2"
        bind:checked={configs.saveWorkingDir}
      >
        Use as a default project directory
      </Checkbox>
    {:else}
      <div></div>
    {/if}
  </div>

  <div class="col-span-2"></div>
</div>
