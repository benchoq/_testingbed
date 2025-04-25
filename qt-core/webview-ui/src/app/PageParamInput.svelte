<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Checkbox, Label } from "flowbite-svelte";

  import SectionLabel from "@/comps/SectionLabel.svelte";
  import NameInput from "./NameInput.svelte";
  import WorkingDirInput from "./WorkingDirInput.svelte";
  import PresetOptionsTable from "./PresetOptionsTable.svelte";

  import { presets, configs, dryRunResult } from "./states.svelte";
  import { createPresetDisplayText } from "./viewlogic.svelte";
</script>

<div class={`w-full h-full grid
  grid-cols-[max-content_1fr]
  grid-rows-[min-content_1fr_repeat(4,min-content)]
  gap-2`}
>
  <SectionLabel text="Preset" />
  <div>&quot;{createPresetDisplayText(presets.selected)}&quot;</div>

  <div></div>
  <div>
    <Label class="qt-label whitespace-pre-wrap leading-relaxed"
      >{(presets.selected?.meta?.description ?? "").replaceAll("\n", "\n\n")}
    </Label>
  </div>

  <div class="h-full mt-1"><SectionLabel text="Options" /></div>
  <div class="w-1/2 flex flex-col gap-2"><PresetOptionsTable /></div>

  <SectionLabel text="Name" /><NameInput />
  <SectionLabel text="Create In" /><WorkingDirInput />

  <div></div>
  {#if configs.type === "project"}
    <Checkbox
      class="self-start qt-checkbox"
      bind:checked={configs.saveWorkingDir}
    >
      Use as default project directory
    </Checkbox>
  {:else}
    <div></div>
  {/if}

</div>
