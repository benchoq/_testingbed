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

  const setCurrentIndex = (i: number) => {
    const candidate = Math.max(0, Math.min(i, wizard.pages.length - 1));
    if (wizard.currentIndex != candidate) {
      wizard.currentIndex = candidate;
      updateVisibilities();
    }
  }

  const updateVisibilities = () => {
    const i = wizard.currentIndex;
    const last = wizard.pages.length - 1;

    wizard.buttons.back.visible = (i > 0);
    wizard.buttons.next.visible = (i < last);
    wizard.buttons.finish.visible = (i === last);
  }
  
  onMount(() => {
    updateVisibilities();
  });

</script>

<div class="col-start-2 flex flex-row gap-2">
  <div class="flex-grow"></div>
    <IconButton
      text="Back"
      icon={AngleLeftOutline}
      flat={true}
      visible={wizard.buttons.back.visible} 
      onClicked={() => {setCurrentIndex(wizard.currentIndex - 1)}}>
    </IconButton>

    <IconButton
      text="Next"
      icon={AngleRightOutline}
      visible={wizard.buttons.next.visible} 
      onClicked={() => {setCurrentIndex(wizard.currentIndex + 1)}}>
    </IconButton>

    <IconButton
      text="Create"
      icon={CheckOutline}
      visible={wizard.buttons.finish.visible}
      disabled={wizard.buttons.finish.disabled}
      onClicked={() => {viewlogic.createItemFromSelectedPreset()}}>
    </IconButton>
</div>
