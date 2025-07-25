<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { ListgroupItem, Tooltip } from 'flowbite-svelte';
  import { DotsHorizontalOutline } from 'flowbite-svelte-icons';

  import TruncatableLabel from '@/comps/TruncatableLabel.svelte';
  import PresetListItemMenu from './PresetListItemMenu.svelte';
  import { ui } from './states.svelte';
  import { PresetWrapper } from './types.svelte';
  import { setSelectedPresetAt } from './viewlogic.svelte';

  let {
    index = (-1),
    preset = new PresetWrapper(),
  } = $props();

  let truncated = $state(false);
  let menuOpened = $state(false);
</script>

<ListgroupItem
  class="qt-list-item flex flex-row gap-1"
  currentClass="selected"
  current={ui.selectedPresetIndex === index}
  on:click={() => {
    setSelectedPresetAt(index);
  }}
>
  <TruncatableLabel 
    text={preset.itemText} 
    class="flex-1"
    bind:truncated
  />

  {#if preset.isCustomPreset()}
    <div class="ml-auto mr-0.5 qt-badge flex flex-row gap-1">
      {preset.title}
      <DotsHorizontalOutline
        class="qt-button borderless"
        onclick={() => { menuOpened = true; }}
      />
      {#if menuOpened }
        <PresetListItemMenu
          open={true}
          onClosed={() => { menuOpened = false; }}
        />
      {/if}
    </div>
  {/if}
</ListgroupItem>

{#if truncated && !menuOpened }
  <Tooltip 
    placement={'top'}
    data-placement={'top'}
    class="qt-tooltip"
    offset={10}
  >
    {preset.itemText}
  </Tooltip>
{/if}
