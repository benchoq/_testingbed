<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import SectionLabel from '@/comps/SectionLabel.svelte';
  import * as texts from './texts';
  import PresetList from './PresetList.svelte';
  import PresetTypeSelector from './PresetTypeSelector.svelte';
  import PresetDescription from './PresetDescription.svelte';
  import PresetOptions from './PresetOptions.svelte';
</script>

<div
  class={`
    grow grid gap-2
    grid-rows-[min-content_1fr] 
    grid-cols-[min-content_minmax(300px,1fr)_1fr]
    `}
>
  <SectionLabel text={texts.wizard.presetList} class="w-full col-span-3" />
  <PresetTypeSelector class="pl-4"/>
  <PresetList />
  <div class="flex flex-col justify-between">
    <PresetDescription />
    <PresetOptions />
  </div>
</div>
