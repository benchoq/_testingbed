<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from "flowbite-svelte";

  let {
    items,
    currentIndex = -1,
    onCurrentIndexChanged = null,
  } = $props();

  function setCurrentIndex(i: number) {
    if (i < 0 || i >= items.length) {
      return;
    }

    if (currentIndex !== i) {
      currentIndex = i;

      if (onCurrentIndexChanged) {
        onCurrentIndexChanged(currentIndex);
      }
    }
  }

  $effect(() => {
    if (currentIndex === -1) {
      if (items && items.length > 0) {
        setCurrentIndex(0);
      }
    }
  });
</script>

<div class="flex flex-col h-full gap-0">
  {#each items as item, i}
    <Button
      on:click={() => { setCurrentIndex(i); } }
      class={`flex flex-col gap-1 qt-vtab-item ${i === currentIndex ? 'selected' : ''}`}>
      <item.icon />
      {item.label}
    </Button>
    {#if i < items.length - 1}
      <div class="qt-vtab-separator"></div>
    {/if}
  {/each}
  <div class="flex-grow"></div>
</div>

