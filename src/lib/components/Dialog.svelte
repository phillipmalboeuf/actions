<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'

  import OeuvrePage from '../../routes/[[locale]]/oeuvres/[id]/+page.svelte'
  import ContextePage from '../../routes/[[locale]]/lignes/[id]/contexte/+page.svelte'
  import ZoomPage from '../../routes/[[locale]]/oeuvres/[id]/zoom/+page.svelte'
  import VideoPage from '../../routes/[[locale]]/lignes/[id]/video/+page.svelte'
  import Icon from './Icon.svelte'
  import { browser } from '$app/environment'
  // import ContactPage from '../../routes/[[locale]]/contact/+page.svelte'

  let innerWidth: number
  let innerHeight: number
  let vertical = false

  $: {
    if (browser) {
      document.documentElement.classList.toggle('noscroll', !!(($page.state.type && $page.state.open) || ($page.state.zoom)))

      if (innerWidth !== undefined) {
        vertical = innerWidth < innerHeight
      }
    }
  }
</script>

<svelte:window bind:innerHeight bind:innerWidth />

{#if $page.state.type && $page.state.open}
<dialog transition:fly={{ opacity: 1, ...vertical ? { y: '100%' } : { x: '100%' }, duration: 666 }} class:vertical class:half={$page.state.type === 'contexte'}>
  {#if $page.state.type === 'oeuvre'}
  <OeuvrePage data={$page.state.open} />
  {:else if $page.state.type === 'contexte'}
  <ContextePage data={$page.state.open} />
  {/if}
</dialog>
<button class="back" transition:fade={{ duration: 666 }} on:click={() => history.back()}>
</button>
<button class="close" class:vertical class:half={$page.state.type === 'contexte'} transition:fly={{ opacity: 1, ...vertical ? { y: '100vh' } : { x: '100vw' }, duration: 666 }} on:click={() => history.back()}>
  <Icon i={vertical ? "arrow" : "back"} label="Retour" />
</button>
{/if}

{#if $page.state.zoom}
<ZoomPage data={$page.state.zoom} onClose={() => {
  history.back()
}} />
{/if}

{#if $page.state.video}
<VideoPage data={$page.state.video} onClose={() => {
  history.back()
}} />
{/if}

<style lang="scss">
  dialog {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    left: auto;
    height: $vh;
    overflow-y: auto;
    width: 90vw;
    z-index: 2000;
    border: none;
    border-top-left-radius: $gap;
    border-bottom-left-radius: $gap;

    &.vertical {
      top: auto;
      bottom: 0;
      height: 90vh;
      width: 100vw;

      border-top-right-radius: $gap;
      border-bottom-left-radius: 0;
    }

    color: currentColor;
    border: none;
    background-color: transparent;

    &.half {
      width: 50vw;

      @media (max-width: $mobile) {
        width: 100vw;
      }
    }

    @media (max-width: $mobile) {
      width: 100vw;
    }
  }

  .back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1999;
    background: fade-out($color: $black, $amount: 0.66);
    border-radius: 0;
    padding: 0;
    border: none;
  }

  .close {
    position: fixed;
    top: $gap;
    left: calc(10vw + ($gap));
    z-index: 2001;
    background: none;
    padding: 0;
    border: none;
    color: currentColor;
    transition: transform 333ms;

    &.vertical {
      top: calc(10vh + $mobile_gap);
    }

    &.half {
      left: calc(50vw + ($gap));

      @media (max-width: $mobile) {
        left: calc(0px + ($mobile_gap));
      }
    }

    &:hover,
    &:focus {
      transform: translateX(20%);
    }

    @media (max-width: $mobile) {
      left: calc(0px + ($mobile_gap));
    }
  }
</style>