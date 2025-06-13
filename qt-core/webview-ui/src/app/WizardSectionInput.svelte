<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Checkbox, P, Button } from 'flowbite-svelte';
  import { CheckOutline, FolderOpenOutline } from 'flowbite-svelte-icons';

  import IconButton from '@/comps/IconButton.svelte';
  import SectionLabel from '@/comps/SectionLabel.svelte';
  import InputWithIssue from '@/comps/InputWithIssue.svelte';
  import * as texts from './texts';
  import { ui } from './states.svelte';
  import {
    validateInput,
    onWorkingDirBrowseClicked,
    createItemFromSelectedPreset
  } from './viewlogic.svelte';
</script>

<div
  class={`grid gap-2
    grid-cols-[max-content_1fr] 
    grid-rows-[1fr_repeat(3,min-content)]`}
>
  <div class="h-full col-span-2 mb-1 flex flex-row items-center">
    <SectionLabel text={texts.wizard.nameAndLocation} />
  </div>

  <!-- name -->
  <P class="qt-label pl-4">{texts.wizard.name}</P>
  <InputWithIssue
    bind:value={ui.input.name}
    onInput={validateInput}
    level={ui.input.issues.name.level}
    message={ui.input.issues.name.message}
  />

  <!-- working directory -->
  <P class="qt-label pl-4">{texts.wizard.workingDir}</P>
  <div class="w-full grid grid-cols-[min-content_1fr] gap-0">
    <Button
      class="qt-button px-2 py-0 rounded-r-none! focus:z-1"
      title={texts.wizard.workingDirTooltip}
      on:click={onWorkingDirBrowseClicked}
      ><FolderOpenOutline />
    </Button>

    <InputWithIssue
      bind:value={ui.input.workingDir}
      class="rounded-l-none! -ml-1"
      onInput={validateInput}
      level={ui.input.issues.workingDir.level}
      message={ui.input.issues.workingDir.message}
    />
  </div>

  <!-- options, create button -->
  <div></div>
  <div class="flex flex-row gap-2">
    {#if ui.selectedType === 'project'}
      <Checkbox
        class="self-start qt-checkbox grow"
        bind:checked={ui.input.saveProjectDir}
      >
        {texts.wizard.workingDirSaveCheckbox}
      </Checkbox>
    {:else}
      <div class="grow"></div>
    {/if}

    <IconButton
      text={texts.wizard.buttons.create}
      icon={CheckOutline}
      disabled={!ui.canCreateItem}
      onClicked={createItemFromSelectedPreset}
    ></IconButton>
  </div>
</div>
