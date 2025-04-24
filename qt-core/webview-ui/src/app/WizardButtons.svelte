<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { 
    AngleLeftOutline, 
    AngleRightOutline, 
    ArrowRightOutline 
  } from "flowbite-svelte-icons";

  let {
    roles = [],
    onClicked,
  } = $props();

  const findIcon = (role: string) => {
    if (role === "back") return AngleLeftOutline;
    if (role === "next") return AngleRightOutline;
    if (role === "finish") return ArrowRightOutline;
    return undefined;
  }

  const findText = (role: string) => {
    if (role === "back") return "Back";
    if (role === "next") return "Next";
    if (role === "finish") return "Finish";
    return "";
  }

</script>

<div class="col-start-2 flex flex-row gap-2">
  <div class="flex-grow"></div>
  {#each roles as role}
    <Button class="qt-button" on:click={() => { onClicked(role)}}>
      {@const IconComp = findIcon(role)}
      {#if IconComp}
        <IconComp class="mr-1" />
      {/if}
      {findText(role)}
    </Button>
  {/each}
</div>
