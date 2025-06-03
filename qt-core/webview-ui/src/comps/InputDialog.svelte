<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Modal, Button, P } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  import InputWithIssue from './InputWithIssue.svelte';

  let {
    open = $bindable(true),
    text = 'Enter the value',
    acceptText = 'Okay',
    value = $bindable(""),
    acceptOnEnter = false,
    onAccepted = (input: string) => {},
    onRejected = () => {}
  } = $props();

  let inputComp: InputWithIssue | undefined;

  function onAcceptClicked() {
    open = false;
    onAccepted(value);
  }

  function onRejectClicked() {
    open = false;
    onRejected();
  }

  function onEnter() {
    if (acceptOnEnter) {
      onAcceptClicked();
    }
  }

  onMount(() => {
    if (inputComp) {
      inputComp.focus();
    }
  })
</script>

<Modal
  bind:open
  color="none"
  class="qt-modal"
  size="sm"
  classBackdrop="qt-backdrop"
  bodyClass="p-4"
  outsideclose
  on:visibilitychange={
    () => { console.log("onvisi.."); }
  }
  on:close={() => { onRejectClicked(); }}
>
  <div class="flex flex-col gap-2">
    <P class='qt-label dialog'>{text}</P>

    <InputWithIssue
      class="qt-input"
      bind:this={inputComp}
      bind:value={value}
      onInput={() => {}}
      onEnter={onEnter}
    />

    <div class="flex flex-row gap-2">
      <div class="grow"></div>
      <Button class="qt-button w-[75px]" on:click={onAcceptClicked}>
        {acceptText}
      </Button>
    </div>
  </div>
</Modal>
