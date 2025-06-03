<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { P } from 'flowbite-svelte';
  import { PlusOutline } from 'flowbite-svelte-icons';

  import IconButton from '@/comps/IconButton.svelte';
  import InputDialog from '@/comps/InputDialog.svelte';
  import SectionLabel from '@/comps/SectionLabel.svelte';
  import * as texts from './texts';
  import { ui, data } from './states.svelte';
  import {
    isCustomPreset,
    isDefaultPreset,
    createCustomPreset
   } from './viewlogic.svelte';
  import PresetList from './PresetList.svelte';
  import PresetToolbar from './PresetToolbar.svelte';
  import PresetTypeSelector from './PresetTypeSelector.svelte';
  import PresetOptionsTable from './PresetOptionsTable.svelte';

  let openCreateDialog = $state(false);
  let newPresetName = $state("untitle");
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
        >{(data.selected.preset?.meta?.description ?? '').replaceAll(
          '\n',
          '\n\n'
        )}
      </P>
    </div>
    <div class="flex-grow"></div>

    {#if data.selected.preset?.prompt?.steps}
      <div class="w-full flex flex-row mb-1">
        <div><SectionLabel text={texts.wizard.options} /></div>
        <div class="grow"></div>
        {#if isDefaultPreset(data.selected.preset?.name)}
          <IconButton
            flat
            icon={PlusOutline}
            text={texts.wizard.buttons.saveAs}
            tooltip={texts.wizard.buttons.saveAsTooltip}
            tooltipPlacement="left"
            visible={ui.preset.canCreate}
            onClicked={() => { openCreateDialog = true; }}
          />
        {/if}
      </div>
      <PresetOptionsTable />
    {/if}

    {#if isCustomPreset(data.selected.preset?.name)}
      <PresetToolbar class="mt-5"/>
    {/if}
  </div>
</div>

<!-- dialogs -->
{#if openCreateDialog}
  <InputDialog
    acceptOnEnter
    bind:open={openCreateDialog}
    bind:value={newPresetName}
    text={texts.wizard.enterNewPresetName}
    onAccepted={() => { createCustomPreset(newPresetName); }}
  />
{/if}
