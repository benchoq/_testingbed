<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import { focusAnyChild } from '@/comps/utils';
  import { onAppMount } from './viewlogic.svelte';
  import Wizard from './Wizard.svelte';
  import './app.css';

  let container: HTMLDivElement;

  onMount(() => { 
    void onAppMount();
    requestAnimationFrame(() => {
      focusAnyChild(container);
    });
  });
</script>

<div 
  bind:this={container}
  class="w-screen h-screen flex items-center justify-center"
>
  <Wizard />
</div>
