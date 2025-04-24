<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { ArrowRightOutline } from "flowbite-svelte-icons";

  let nameHasError = $state(false);
  let workingDirHasError = $state(false);
  let isDisabled = $derived(nameHasError || workingDirHasError);

  let {
    onNextClicked
  } = $props();
</script>

<div class="col-start-2 grid grid-cols-[1fr_min-content]">
  <div></div>
  <Button
    class="qt-button"
    disabled={isDisabled}
    on:click={onNextClicked}
  >
    <ArrowRightOutline class="mr-3" />Next
  </Button>
</div>
