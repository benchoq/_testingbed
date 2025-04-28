<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { Modal } from "flowbite-svelte";

  import * as utils from "@/logic/utils";
  import * as viewlogic from "./viewlogic.svelte";
  import { wizard } from "./states.svelte";
  import PageParamInput from "./PageParamInput.svelte";
  import PagePresetSelector from "./PagePresetSelector.svelte";
  import WizardButtons from "./WizardButtons.svelte";

  const pages = [
    { component: PagePresetSelector, title: "Select what to create" },
    { component: PageParamInput, title: "Configure details" }
  ];

  let currentPage = $derived(pages[wizard.currentIndex]);

  const onButtonClicked = (role: string) => {
    if (role === "back") {
      setCurrentIndex(wizard.currentIndex - 1);
    } else if (role === "next") {
      setCurrentIndex(wizard.currentIndex + 1);
    } else if (role === "finish") {
      viewlogic.createItemFromSelectedPreset();
    }
  }

  const setCurrentIndex = (i: number) => {
    const candidate = Math.max(0, Math.min(i, pages.length - 1));
    if (wizard.currentIndex != candidate) {
      wizard.currentIndex = candidate;
      updateButtons();
    }
  }

  const updateButtons = () => {
    if (wizard.currentIndex === 0) {
      wizard.buttons.back.visible = false
      wizard.buttons.next.visible = true
      wizard.buttons.finish.visible = false
    } else if (wizard.currentIndex === (pages.length - 1)) {
      wizard.buttons.back.visible = true
      wizard.buttons.next.visible = false
      wizard.buttons.finish.visible = true
    } else {
      wizard.buttons.back.visible = true
      wizard.buttons.next.visible = true
      wizard.buttons.finish.visible = false
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
    <WizardButtons onClicked={onButtonClicked} />
  </svelte:fragment>
</Modal>
