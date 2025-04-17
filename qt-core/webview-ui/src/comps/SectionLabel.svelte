<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Label } from "flowbite-svelte";
  import { ChevronRightOutline } from "flowbite-svelte-icons";
  let { 
    text,
    icon = true,
    class: className = "" 
  } = $props();
</script>

<div class={`flex flex-row self-center ${className}`}>
  {#if icon}
    <ChevronRightOutline class="qt-label-highlight" />
  {/if}
  <Label class="qt-label-highlight">{text}</Label>
</div>
