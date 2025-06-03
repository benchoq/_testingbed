<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Modal, Button, P } from 'flowbite-svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';

  let {
    open = $bindable(true),
    text = 'Select your answer',
    acceptText = 'Yes',
    rejectText = 'No',
    onAccepted = () => {},
    onRejected = () => {}
  } = $props();

  function onAcceptClicked() {
    open = false;
    onAccepted();
  }

  function onRejectClicked() {
    open = false;
    onRejected();
  }
</script>

<Modal
  bind:open
  color="none"
  class="qt-modal"
  size="sm"
  classBackdrop="qt-backdrop"
  bodyClass="px-2 py-4"
  outsideclose
  on:close={() => {
    onRejected();
  }}
>
  <div class="flex flex-row gap-1">
    <ArrowRightOutline size="lg" class="qt-label dialog"/>
    <P class='qt-label dialog'>{text}</P>
  </div>

  <div class="flex flex-row gap-2 mt-5">
    <div class="grow"></div>
    <Button class="qt-button" on:click={onAcceptClicked}>
      {acceptText}
    </Button>
    <Button class="qt-button" on:click={onRejectClicked}>
      {rejectText}
    </Button>
    <div></div>
  </div>
</Modal>
