<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Label, Listgroup, ListgroupItem, P } from "flowbite-svelte";
  import PresetOptionsTable from "./PresetOptionsTable.svelte";
  import { presets } from "./states.svelte";
  import { setSelectedPreset } from "./viewlogic.svelte";
  
  const createListItemText = (preset: any) => {
    if (preset.name.startsWith("@")) {
      return preset.meta.title
    } else {
      return preset.name
    }
  }

  const adjustSelectedIndex = (offset: number) => {
    if (!presets.selected || (presets.selectedIndex < 0)) {
      return;
    }

    let candidate = presets.selectedIndex + offset;
    candidate = Math.max(0, candidate);
    candidate = Math.min(candidate, presets.all.length - 1)

    if (candidate != presets.selectedIndex) {
      setSelectedPreset(presets.all[candidate], candidate);
    }
  }

  const onKeyPressed = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") { 
      adjustSelectedIndex(-1);
    } else if (e.key === "ArrowDown") {
      adjustSelectedIndex(+1);
    } else {
      return;
    }

    const el = e.currentTarget as HTMLElement;
    if (el) {
      const items = el?.querySelectorAll('button');
      const item = items[presets.selectedIndex]
      if (item instanceof HTMLButtonElement) {
        item.focus();
      }
    }
  }
</script>

<div class={`grid
   grid-cols-[minmax(320px,1fr)_1fr]
   h-full`}>
  <!-- preset list -->
  <Listgroup active 
    class="flex-grow overflow-y-auto qt-list"
    onkeydown={onKeyPressed}
    tabindex={0}
  >
    {#each presets.all as preset, index}
      <ListgroupItem
        class="qt-list-item flex flex-row"
        currentClass="selected"
        current={presets.selectedIndex === index}
        on:click={() => { setSelectedPreset(preset, index) }}
      >
        <div class="flex-1">{createListItemText(preset)}</div>
        {#if !preset.name.startsWith("@")}
          <P size="xs" class="qt-label">{preset.meta.title}</P>
        {:else}
          <div></div>
        {/if}
      </ListgroupItem>
    {/each}
  </Listgroup>

  <!-- description and option table -->
  <div class="grid grid-rows-[1fr_min-content] pl-2">
    <div>
      <Label 
        class="qt-label whitespace-pre-wrap leading-relaxed"
      >{(presets.selected?.meta?.description ?? '').replaceAll("\n", "\n\n")}
      </Label>
    </div>
    <PresetOptionsTable></PresetOptionsTable>
  </div>
</div>
