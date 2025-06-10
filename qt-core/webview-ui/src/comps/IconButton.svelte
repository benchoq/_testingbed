<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import type { Placement } from '@floating-ui/dom';
  import { Button, Tooltip } from 'flowbite-svelte';
  import { CheckOutline } from 'flowbite-svelte-icons';

  let {
    id = '',
    text = '',
    tooltip = '',
    tooltipPlacement = 'top' as Placement,
    icon = CheckOutline,
    flat = false,
    inline = false,
    borderless = false,
    visible = true,
    disabled = false,
    class: className = '',
    iconOnlyClass = 'p-2',
    onClicked = () => {}
  } = $props();

  let iconOnly = $derived(text.length === 0)
</script>

{#if visible}
  <Button
    {disabled}
    class={`
      qt-button m-0
      ${flat ? 'flat' : ''}
      ${inline ? 'inline' : ''}
      ${borderless ? 'borderless' : ''}
      ${iconOnly ? iconOnlyClass: ''}
      ${className}
    `}
    on:click={() => {
      onClicked(id);
    }}
  >
    {@const IconComp = icon}
    {#if IconComp}
      <IconComp class={iconOnly ? '' : 'mr-2'} />
    {/if}
    {text}
  </Button>
  
  {#if tooltip.length !== 0}
    <Tooltip placement={tooltipPlacement} class="qt-tooltip">
      {tooltip}
    </Tooltip>
  {/if}
{/if}
