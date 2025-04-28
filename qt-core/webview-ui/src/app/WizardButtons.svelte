<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { 
    AngleLeftOutline, 
    AngleRightOutline, 
    CheckOutline 
  } from "flowbite-svelte-icons";

  import { wizard } from "./states.svelte";
  import WizardButton from "./WizardButton.svelte";

  let {
    onClicked,
  } = $props();

</script>

<div class="col-start-2 flex flex-row gap-2">
  <div class="flex-grow"></div>
    <WizardButton 
      text="Back"
      icon={AngleLeftOutline}
      visible={wizard.buttons.back.visible} 
      onClicked={() => {onClicked("back")}}>
    </WizardButton>

    <WizardButton 
      text="Next"
      icon={AngleRightOutline}
      visible={wizard.buttons.next.visible} 
      onClicked={() => {onClicked("next")}}>
    </WizardButton>

    <WizardButton 
      text="Create"
      icon={CheckOutline}
      visible={wizard.buttons.finish.visible}
      disabled={wizard.buttons.finish.disabled}
      onClicked={() => {onClicked("finish")}}>
    </WizardButton>
</div>
