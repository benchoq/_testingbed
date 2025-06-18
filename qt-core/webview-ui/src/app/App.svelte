<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import './app.css';
  import { onAppMount } from './viewlogic.svelte';
  import Wizard from './Wizard.svelte';

  let container: HTMLDivElement;

  function focusAnyChild() {
    const selector = '[tabindex]:not([tabindex="-1"])';
    const fallback = container?.querySelector(selector) as HTMLElement;
    fallback?.focus();
  }

  onMount(() => { 
    onAppMount();
    requestAnimationFrame(focusAnyChild);
  });
</script>

<div 
  bind:this={container}
  class="w-screen h-screen flex items-center justify-center"
>
  <Wizard />
</div>
