<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { Modal } from "flowbite-svelte";

  import * as utils from "@/logic/utils";
  import * as viewlogic from "./viewlogic.svelte";
  import PageParamInput from "./PageParamInput.svelte";
  import PagePresetSelector from "./PagePresetSelector.svelte";
  import WizardButtons from "./WizardButtons.svelte";

  onMount(() => {
    if (utils.isDev()) {
      viewlogic.loadPresets();
    }
  });

  const pages = [
    { component: PagePresetSelector },
    { component: PageParamInput }
  ];
  let currentIndex = $state(0);
  let currentPage = $derived(pages[currentIndex]) // TODO: validate index

  const onNextClicked = () => {
    currentIndex = 1 - currentIndex;
  }
</script>

<Modal
  title="Create a new item"
  size="md"
  color="none"
  open
  class="qt-modal"
  backdropClass="hidden"
  footerClass="p-3"
  style="height: 80vh;"
  on:close={viewlogic.onModalClosed}
>
  <div class="w-full h-full">
    <currentPage.component />
  </div>

  <svelte:fragment slot="footer">
    <WizardButtons {onNextClicked} />
  </svelte:fragment>
</Modal>
