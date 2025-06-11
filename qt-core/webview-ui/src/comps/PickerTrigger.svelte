<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

  let {
    text = '-',
    open = $bindable(false),
    aboutToOpen = (r: DOMRect) => {}
  } = $props();

  let rawElement: HTMLButtonElement;

  function onTrigged(e: MouseEvent) {
    if (open) {
      open = false;
      return;
    }

    aboutToOpen(rawElement.getBoundingClientRect());
    open = true;
  }

  function onClickedAnywhere(e: MouseEvent) {
    if (!rawElement.contains(e.target as Node)) {
      open = false;
    }
  }

  onMount(() => {
    window.addEventListener('click', onClickedAnywhere);
  });

  onDestroy(() => {
    window.removeEventListener('click', onClickedAnywhere);
  });
</script>

<button
  class={`
    w-full flex items-center justify-between
    qt-picker-trigger ${open ? 'open' : ''}
  `}
  bind:this={rawElement}
  onclick={onTrigged}
>
  <div class="truncate">{text}</div>
  <ChevronDownOutline class="w-4 h-4" />
</button>
