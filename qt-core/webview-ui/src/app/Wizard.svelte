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

  const pages = [
    { component: PagePresetSelector, title: "Select what to create" },
    { component: PageParamInput, title: "Configure details" }
  ];

  let currentIndex = $state(0);
  let currentPage = $derived(pages[currentIndex]); // TODO: validate index
  let buttonRoles = $state([ "back", "next", "create" ])

  const onButtonClicked = (role: string) => {
    if (role === "back") {
      setCurrentIndex(currentIndex - 1);
    } else if (role === "next") {
      setCurrentIndex(currentIndex + 1);
    } else if (role === "create") {
      viewlogic.createItemFromSelectedPreset();
    }
  }

  const setCurrentIndex = (i: number) => {
    const candidate = Math.max(0, Math.min(i, pages.length - 1));
    if (currentIndex != candidate) {
      currentIndex = candidate;
      updateButtons();
    }
  }

  const updateButtons = () => {
    if (currentIndex === 0) {
      buttonRoles = ["next"];
    } else if (currentIndex === (pages.length - 1)) {
      buttonRoles = ["back", "create"]
    } else {
      buttonRoles = ["back", "next"]
    }
  }
  
  onMount(() => {
    updateButtons();

    if (utils.isDev()) {
      viewlogic.loadPresets();
    }
  });

</script>

<Modal
  open
  size="lg"
  color="none"
  class="qt-modal w-[80vw] h-[80vh] min-w-[500px] min-h-[500px]"
  backdropClass="hidden"
  footerClass="p-3"
  on:close={viewlogic.onModalClosed}
>
  <svelte:fragment slot="header">
    <div class="qt-modal-title">{currentPage.title}</div>
  </svelte:fragment>

  <div class="w-full h-full">
    <currentPage.component />
  </div>

  <svelte:fragment slot="footer">
    <WizardButtons roles={buttonRoles} onClicked={onButtonClicked} />
  </svelte:fragment>
</Modal>
