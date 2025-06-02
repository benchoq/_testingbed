<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Modal, Button, Input } from 'flowbite-svelte';

  let {
    open = $bindable(true),
    title = 'Input',
    acceptText = 'OK',
    rejectText = 'Cancel',
    value = $bindable(""),
    onAccepted = (input: string) => {},
    onRejected = () => {}
  } = $props();

  function onAcceptClicked() {
    open = false;
    onAccepted(value);
  }

  function onRejectClicked() {
    open = false;
    onRejectClicked();
  }
</script>

<Modal 
  bind:open
  size="sm"
  backdropClass="hidden"
  {title}
  on:close={() => { onRejected(); }}
>
  <div>
    <Input class="qt-input" bind:value={value} />
  </div>

  <div>
    <Button 
      class="qt-button" 
      on:click={onAcceptClicked}>
      {acceptText}
    </Button>
    <Button 
      class="qt-button flat" 
      on:click={onRejectClicked}>
      {rejectText}
    </Button>
  <div>
</Modal>
