<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import _ from "lodash";
  import { onMount } from "svelte";
  import { Modal } from "flowbite-svelte";

  import LoadingMask from "@/comps/LoadingMask.svelte";
  import SectionLabel from "@/comps/SectionLabel.svelte";
  import NameInput from "./NameInput.svelte";
  import WorkingDirInput from "./WorkingDirInput.svelte";
  import ControlInput from "./ControlInput.svelte";
  import PresetSelector from "./PresetSelector.svelte";
  import PresetTypeSelector from "./PresetTypeSelector.svelte";

  import * as states from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";

  onMount(() => {
    if (import.meta.env.DEV) {
      viewlogic.loadPresets();
    }
  });
</script>

<Modal
  title="Create a new item"
  open
  size="md"
  backdropClass="hidden"
  color="none"
  class="qt-modal"
  classBody="md:p-4"
  classHeader="md:p-4"
  style="height: 80vh;"
  on:close={viewlogic.notifyClosed}
>
  <div class="w-full h-full">
    <div
      class={`w-full h-full grid 
      grid-cols-[max-content_1fr]
      grid-rows-[min-content_1fr_min-content_min-content_min-content]
      gap-2`}
    >
      <SectionLabel text="Available presets" class="col-span-2"/>
      <PresetTypeSelector />
      <PresetSelector />
      <SectionLabel text="Name" /><NameInput />
      <SectionLabel text="Create In" /><WorkingDirInput />

      <div class="flex flex-row self-center"></div>
      <ControlInput />
    </div>
    <LoadingMask {...states.loading} />
  </div>
</Modal>

