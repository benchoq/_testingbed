<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import _ from "lodash";
  import PickerList from './PickerList.svelte';
  import PickerTrigger from './PickerTrigger.svelte';

  let {
    open = false,
    itemTexts = [] as string[],
    defaultText = '',
    onSelected = (i: number) => {}
  } = $props();

  let triggerRect = $state(new DOMRect());
  let currentIndex = $state(-1);
  
  function onRejected() {
    open = false;
  }

  function onAccepted(i: number) {
    currentIndex = i;
    open = false;
    onSelected(currentIndex)
  }

  function onAboutToOpen(r: DOMRect) {
    triggerRect = r;

    if (currentIndex === -1 && defaultText.length !== 0) {
      currentIndex = itemTexts.indexOf(defaultText)
    }
  }

  $effect(() => {
    if (currentIndex === -1) {
      if ((itemTexts.length > 0) && (defaultText.length > 0)) {
        currentIndex = itemTexts.indexOf(defaultText)
      }
    }
  })
</script>

<PickerTrigger
  text={itemTexts[currentIndex]}
  bind:open={open}
  aboutToOpen={onAboutToOpen}
/>

{#if open}
  <PickerList 
    {itemTexts} 
    {triggerRect}
    {onAccepted}
    {onRejected}
    {currentIndex}
  />
{/if}
