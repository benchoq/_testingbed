<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { Modal } from 'flowbite-svelte';

  import * as texts from './texts';
  import { ui } from './states.svelte';
  import { onModalClosed } from './viewlogic.svelte';
  import LoadingMask from '@/comps/LoadingMask.svelte';
  import WizardInputSection from './WizardInputSection.svelte';
  import WizardPresetSection from './WizardPresetSection.svelte';
  import WizardAllDialogs from './WizardAllDialogs.svelte';
</script>

<Modal
  open
  dismissable={false}
  size="lg"
  color="none"
  class="qt-panel w-[80vw] h-[90vh] min-w-[500px] min-h-[500px]"
  backdropClass="hidden"
  on:close={onModalClosed}
>
  <svelte:fragment slot="header">
    <div class="qt-panel-header">
      {texts.wizard.title}
    </div>
  </svelte:fragment>

  <div class="w-full h-full flex flex-col gap-4">
    <WizardPresetSection />
    <WizardInputSection />
    <LoadingMask
      {...ui.loading}
      busyText={texts.loading.busy}
      closeText={texts.loading.close}
    />
    <WizardAllDialogs />
  </div>

</Modal>
