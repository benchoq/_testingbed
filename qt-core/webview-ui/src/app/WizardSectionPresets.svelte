<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { P, Button } from 'flowbite-svelte';
  import { PlusOutline } from 'flowbite-svelte-icons';

  import IconButton from '@/comps/IconButton.svelte';
  import SectionLabel from '@/comps/SectionLabel.svelte';
  import * as texts from './texts';
  import { ui, preset } from './states.svelte';
  import { updateCustomPreset } from './viewlogic.svelte';
  import PresetList from './PresetList.svelte';
  import PresetTypeSelector from './PresetTypeSelector.svelte';
  import PresetOptionsTable from './PresetOptionsTable.svelte';

  let createEnabled = $derived.by(() => {
    return preset.selection.isDefaultPreset() 
      && preset.selection.hasSteps()
      && (Object.keys(ui.unsavedOptionChanges).length !== 0);
  });

  let saveEnabled = $derived.by(() => {
    return preset.selection.isCustomPreset() 
      && (Object.keys(ui.unsavedOptionChanges).length !== 0);
  });
</script>

<div
  class={`
    grow grid gap-2
    grid-rows-[min-content_1fr] 
    grid-cols-[min-content_minmax(300px,1fr)_1fr]
    `}
>
  <SectionLabel text={texts.wizard.presetList} class="w-full col-span-3" />
  <PresetTypeSelector />
  <PresetList />
  <div class="flex flex-col">
    <SectionLabel text={texts.wizard.description} />
    <div>
      <P class="qt-label whitespace-pre-wrap leading-relaxed"
        >{preset.selection.description}
      </P>
    </div>
    <div class="flex-grow"></div>

    {#if preset.selection.steps}
      <div class="w-full flex items-end justify-between mb-2">
        <div>
          <SectionLabel text={texts.wizard.options} />
        </div>
        <div class={`
          flex flex-row transition-opacity duration-200
          ${!(createEnabled || saveEnabled) ? 'opacity-0 pointer-events-none' : ''}
          `}
        >
          <IconButton
            icon={PlusOutline}
            tooltip={texts.wizard.buttons.saveAsTooltip}
            tooltipPlacement="top-end"
            visible={createEnabled}
            onClicked={() => { ui.activeDialog.input = 'create'; }}
          />

          <Button class="qt-button"
            on:click={updateCustomPreset}
            hidden={!saveEnabled}
          >
            {texts.wizard.buttons.update}
          </Button>
        </div>
      </div>
      <PresetOptionsTable />
    {/if}
  </div>
</div>
