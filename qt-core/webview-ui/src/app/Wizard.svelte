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
    { component: PagePresetSelector },
    { component: PageParamInput }
  ];

  let currentIndex = $state(0);
  let currentPage = $derived(pages[currentIndex]) // TODO: validate index
  let buttonRoles = $state([ "back", "next", "finish" ])

  const onButtonClicked = (role: string) => {
    if (role === "back") {
      setCurrentIndex(currentIndex - 1);
    } else if (role === "next") {
      setCurrentIndex(currentIndex + 1);
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
      buttonRoles = ["back", "finish"]
    } else {
      buttonRoles = ["back", "next"]
    }
  }
  
  $effect(() => {
    updateButtons()
  })

  onMount(() => {
    if (utils.isDev()) {
      viewlogic.loadPresets();
    }
  });

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
    <WizardButtons roles={buttonRoles} onClicked={onButtonClicked} />
  </svelte:fragment>
</Modal>
