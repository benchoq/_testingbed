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

  import { presets, configs } from "./states.svelte";
  import { createPresetDisplayText } from "./viewlogic.svelte";
</script>

<div class={`w-full h-full grid gap-2
  grid-cols-[max-content_1fr] grid-rows-[1fr_repeat(3,min-content)]`}
>
  <div class="h-full col-span-2 text-md">
    <SectionLabel text={`
      Create a ${configs.type} from "${createPresetDisplayText(presets.selected)}"`} />
    <div class="p-4 grid grid-cols-2 gap-4">
      <Label class="qt-label whitespace-pre-wrap leading-relaxed">
        {(presets.selected?.meta?.description ?? "")}
      </Label>
      <PresetOptionsTable />
    </div>
  </div>

  <div class="h-full col-span-2 text-md mb-1">
    <SectionLabel text="Name and location" />
  </div>

  <Label class="qt-label pl-4">Name</Label><NameInput />
  <Label class="qt-label pl-4">Create in</Label><WorkingDirInput />

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
