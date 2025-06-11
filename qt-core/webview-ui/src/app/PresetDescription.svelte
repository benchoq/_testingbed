<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { P } from 'flowbite-svelte';

  import SectionLabel from '@/comps/SectionLabel.svelte';
  import * as texts from './texts';
  import { preset } from './states.svelte';
</script>

<div>
  <SectionLabel text={texts.wizard.description} />
  <P class="qt-label whitespace-pre-wrap leading-relaxed">
    {preset.selection.description}
  </P>
</div>