<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { 
    AngleLeftOutline, 
    AngleRightOutline, 
    CheckOutline 
  } from "flowbite-svelte-icons";

  import { wizard } from "./states.svelte";
  import * as viewlogic from "./viewlogic.svelte";
  import IconButton from "@/comps/IconButton.svelte";

  onMount(() => {
    viewlogic.updateWizardButtons();
  });

</script>

<div class="col-start-2 flex flex-row gap-2">
  <div class="flex-grow"></div>
    <IconButton
      text="Back"
      icon={AngleLeftOutline}
      flat={true}
      visible={wizard.buttons.back.visible} 
      onClicked={() => {viewlogic.moveWizardPage(-1)}}>
    </IconButton>

    <IconButton
      text="Next"
      icon={AngleRightOutline}
      visible={wizard.buttons.next.visible} 
      onClicked={() => {viewlogic.moveWizardPage(1)}}>
    </IconButton>

    <IconButton
      text="Create"
      icon={CheckOutline}
      visible={wizard.buttons.finish.visible}
      disabled={wizard.buttons.finish.disabled}
      onClicked={() => {viewlogic.createItemFromSelectedPreset()}}>
    </IconButton>
</div>
