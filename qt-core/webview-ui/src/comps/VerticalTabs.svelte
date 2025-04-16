<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { FileOutline } from "flowbite-svelte-icons";

  let {
    items,
    currentIndex = $bindable(-1),
  } = $props();

  function setCurrentIndex(i: number) {
    if (i >= 0 && i < items.length) {
      currentIndex = i;
    }
  }

  $effect(() => {
    if (items && items.length > 0) {
      currentIndex = 0
    } else {
      currentIndex = -1;
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

