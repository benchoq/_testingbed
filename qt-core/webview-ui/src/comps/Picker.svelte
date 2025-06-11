<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import _ from "lodash";
  import { FileCloneOutline } from 'flowbite-svelte-icons';

  import PickerList from './PickerList.svelte';
  import PickerTrigger from './PickerTrigger.svelte';

  let {
    open = false,
    showIcon = true,
    items = [] as { text: string, icon: (typeof FileCloneOutline | undefined) }[],
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

    if (currentIndex === -1 && defaultText.length > 0) {
      currentIndex = items.findIndex((e) => e.text === defaultText);
    }
  }

  $effect(() => {
    if (currentIndex === -1) {
      if ((items.length > 0) && (defaultText.length > 0)) {
        currentIndex = items.findIndex((e) => e.text === defaultText);
      }
    }
  })
</script>

<PickerTrigger
  text={items[currentIndex]?.text ?? '-'}
  bind:open
  aboutToOpen={onAboutToOpen}
/>

<PickerList 
  bind:open
  {showIcon}
  width={triggerRect.width}
  {items}
  {onAccepted}
  {onRejected}
  {currentIndex}
/>

