<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import './app.css';
  import Wizard from "./Wizard.svelte";
  import { onAppMount } from './viewlogic.svelte'; 

  onMount(onAppMount);
</script>

<Wizard />
