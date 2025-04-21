<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Label } from "flowbite-svelte";

  import { presets } from "./states.svelte";
  import SectionLabel from "@/comps/SectionLabel.svelte";
  import PresetOptionsTable from "./PresetOptionsTable.svelte";
</script>

<div class="grid grid-rows-[min-content_1fr_min-content] pl-2">
  <SectionLabel text="Description" icon={false} class="mb-1" />
  <div>
    <Label class="qt-label whitespace-pre-wrap leading-relaxed"
      >{(presets.selected?.meta?.description ?? "").replaceAll("\n", "\n\n")}
    </Label>
  </div>
  <PresetOptionsTable></PresetOptionsTable>
</div>
