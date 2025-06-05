<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Listgroup, ListgroupItem } from 'flowbite-svelte';

  import { preset, ui } from './states.svelte';
  import { PresetWrapper } from './types.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let wrappedPresets = $derived.by(() => {
    return preset.all.map(p => new PresetWrapper(p));
  });

  const adjustSelectedIndex = (offset: number) => {
    if (!preset.selection.isValid() || ui.selectedPresetIndex < 0) {
      return;
    }

    let candidate = ui.selectedPresetIndex + offset;
    candidate = Math.max(0, candidate);
    candidate = Math.min(candidate, preset.all.length - 1);

    if (candidate != ui.selectedPresetIndex) {
      viewlogic.setSelectedPresetAt(candidate);
    }
  };

  const onKeyPressed = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      adjustSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      adjustSelectedIndex(+1);
    } else if (e.key === 'Delete') {
      if (preset.selection.isCustomPreset()) {
        ui.dialogs.deleteConfirm = true;
      }
    } else {
      return;
    }

    const el = e.currentTarget as HTMLElement;
    if (el) {
      const items = el?.querySelectorAll('button');
      const item = items[ui.selectedPresetIndex];
      if (item instanceof HTMLButtonElement) {
        item.focus();
      }
    }
  };
</script>

<div class="flex flex-col">
  <Listgroup
    active
    class="flex-grow overflow-y-auto qt-list items-center"
    onkeydown={onKeyPressed}
    tabindex={0}
  >
    {#each wrappedPresets as preset, index (index)}
      <ListgroupItem
        class="qt-list-item flex flex-row"itemText
        currentClass="selected"
        current={ui.selectedPresetIndex === index}
        on:click={() => {
          viewlogic.setSelectedPresetAt(index);
        }}
      >
        <div class="flex-1">
          {preset.itemText}
        </div>

        {#if preset.isCustomPreset()}
          <div class="ml-auto mr-0.5 qt-badge flex flex-row gap-2">
            {preset.title}
          </div>
        {:else}
          <div></div>
        {/if}
      </ListgroupItem>
    {/each}
  </Listgroup>
</div>
