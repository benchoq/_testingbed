<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Modal } from "flowbite-svelte";

  import * as viewlogic from "./viewlogic.svelte";
  import { wizard } from "./states.svelte";
  import WizardButtons from "./WizardButtons.svelte";
  
  let currentPage = $derived.by(() => {
    return wizard.pages[wizard.currentIndex]
  })

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
    <WizardButtons />
  </svelte:fragment>
</Modal>
