<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Listgroup } from 'flowbite-svelte';

  import PresetListItem from './PresetListItem.svelte';
  import { preset, ui } from './states.svelte';
  import { PresetWrapper } from './types.svelte';
  import { setSelectedPresetAt } from './viewlogic.svelte';

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
      setSelectedPresetAt(candidate);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      adjustSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      adjustSelectedIndex(+1);
    } else if (e.key === 'Delete') {
      if (preset.selection.isCustomPreset()) {
        ui.activeDialog = 'delete';
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
    
    e.preventDefault();
  };
</script>

<div class="flex flex-col">
  <Listgroup
    active
    class="flex-grow overflow-y-auto qt-list items-center"
    onkeydown={onKeyDown}
    tabindex={0}
  >
    {#each wrappedPresets as preset, index (preset.id)}
      <PresetListItem {preset} {index} />
    {/each}
  </Listgroup>
</div>
