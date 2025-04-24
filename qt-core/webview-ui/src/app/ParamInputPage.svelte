<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import SectionLabel from "@/comps/SectionLabel.svelte";
  import NameInput from "./NameInput.svelte";
  import WorkingDirInput from "./WorkingDirInput.svelte";
  import { presets } from "./states.svelte";
</script>

<div class={`w-full h-full grid
  grid-cols-[max-content_1fr]
  grid-rows-[min-content_min-content_min-content_1fr]
  gap-2`}
>
  <SectionLabel text="Preset" />
  <div>
    {presets.selected?.name}
  </div>
  <SectionLabel text="Name" /><NameInput />
  <SectionLabel text="Create In" /><WorkingDirInput />
  <div></div>
</div>
