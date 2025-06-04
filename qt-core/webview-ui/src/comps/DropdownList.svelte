<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { P } from 'flowbite-svelte';

  let {
    itemTexts = [] as string[],
    currentIndex = -1,
    onRejected = () => {},
    onAccepted = (i: number) => {},
    triggerRect = new DOMRect()
  } = $props();

  let wrapper: HTMLDivElement;
  let items = $state([] as (P | null)[]);

  function setCurrentIndex(i: number) {
    const candidate = Math.max(0, Math.min(i, itemTexts.length - 1));
    if (currentIndex !== candidate) {
      currentIndex = candidate;
    }
  }

  function onItemClicked(i: number) {
    setCurrentIndex(i);
    onAccepted(currentIndex);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onRejected();
    } else if (e.key === 'Enter') {
      onAccepted(currentIndex);
    } else if (e.key === 'ArrowDown') {
      setCurrentIndex((currentIndex + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      setCurrentIndex((currentIndex - 1 + items.length) % items.length);
    } else {
      return;
    }

    e.preventDefault();
  }

  onMount(() => {
    wrapper.focus();
    document.body.appendChild(wrapper);
    window.addEventListener('keydown', onKeyDown);
  });

  onDestroy(() => {
    if (wrapper?.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }

    window.removeEventListener('keydown', onKeyDown);
  });

  $effect(() => {
    if (currentIndex === -1) {
      if (items && items.length > 0) {
        setCurrentIndex(0);
      }
    }
  });
</script>

<div
  bind:this={wrapper}
  tabindex="0"
  role="listbox"
  class="qt-dropdown-wrapper max-h-[200px] z-[100]"
  style={`position: absolute; 
    left: ${triggerRect.left}px; 
    top: ${triggerRect.bottom}px; 
    width: ${triggerRect.width}px;`}
>
  {#each itemTexts as text, i (i)}
    <P
      bind:this={items[i]}
      role="option"
      class={`qt-list-item ${i === currentIndex ? 'selected' : ''}`}
      onclick={() => onItemClicked(i)}
    >
      {text}
    </P>
  {/each}
</div>
