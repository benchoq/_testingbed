<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import _ from "lodash";
  import { onMount } from "svelte";
  import { Modal } from "flowbite-svelte";
  
  import LoadingMask from "@/comps/LoadingMask.svelte";
  import PresetSelector from "./PresetSelector.svelte";
  import ParamsInput from "./ParamsInput.svelte";
  import * as states from './states.svelte';
  import * as logic from "./viewlogic.svelte";

  const title = $derived((states.configs.type === "project") ? 
    "Create a new project" : "Create a new file, class");
  
  onMount(() => {
    if (import.meta.env.DEV) {
      logic.loadPresets();
    }
  });
</script>

<Modal {title}
  open size="md" backdropClass="hidden"
  color="none"
  class="qt-modal"
  style="height: 85vh;"
  on:close={logic.notifyClosed}
>
  <div class="w-full h-full">
    <div class="w-full h-full grid grid-cols-1 grid-rows-[1fr_auto] gap-2">
      <PresetSelector />
      <ParamsInput />
    </div>
    <LoadingMask {...states.loading} />
  </div>
</Modal>
