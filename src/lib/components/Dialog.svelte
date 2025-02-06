<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'

  import OeuvrePage from '../../routes/[[locale]]/oeuvres/[id]/+page.svelte'
  import ContextePage from '../../routes/[[locale]]/lignes/[id]/contexte/+page.svelte'
  import ZoomPage from '../../routes/[[locale]]/oeuvres/[id]/zoom/+page.svelte'
  import ZoomArchivePage from '../../routes/[[locale]]/oeuvres/[id]/archives/[asset_id]/zoom/+page.svelte'
  import VideoPage from '../../routes/[[locale]]/lignes/[id]/video/+page.svelte'
  import Icon from './Icon.svelte'
  import NoScroll from './NoScroll.svelte'

  import { browser } from '$app/environment'
  import { onNavigate, pushState } from '$app/navigation'

  let innerWidth: number
  let innerHeight: number
  let vertical = false
  let element: HTMLDialogElement
  let button: HTMLButtonElement

  $: {
    if (browser) {
      if (innerWidth !== undefined) {
        vertical = innerWidth < innerHeight
      }
    }
  }

  $: {
    if (browser && element && $page.state.type && $page.state.open) {
      element.scrollTo({ top: 0 })
      element.focus()
    }
  }

  const close = () => pushState($page.url.href, {})
</script>

<svelte:window bind:innerHeight bind:innerWidth on:keydown={e => {
  if (e.key === 'Escape') {
    close()
  }
}} />

{#if $page.state.type && $page.state.open}
<NoScroll />
<dialog transition:fly={{ opacity: 1, ...vertical ? { y: '100%' } : { x: '100%' }, duration: 666 }} class:vertical class:half={$page.state.type === 'contexte'} bind:this={element} tabindex="-1">
  <button class="close button--none" class:vertical class:half={$page.state.type === 'contexte'} on:click={close} bind:this={button} tabindex="0">
    <Icon i={vertical ? "arrow" : "back"} label="Retour" />
  </button>

  {#if $page.state.type === 'oeuvre'}
  <OeuvrePage data={$page.state.open} dialog />
  {:else if $page.state.type === 'contexte'}
  <ContextePage data={$page.state.open} dialog />
  {/if}

  <button class="last button--none" on:click={close}>
    <Icon i={vertical ? "arrow" : "back"} label="Retour" /> Revenir à la ligne du temps
  </button>
</dialog>
<button class="back" transition:fade={{ duration: 666 }} on:click={close}>
</button>
<!-- <button class="close button--none" class:vertical class:half={$page.state.type === 'contexte'} transition:fly={{ opacity: 1, ...vertical ? { y: '100vh', opacity: 0 } : { x: '100vw' }, duration: 666 }} on:click={close}>
  <Icon i={vertical ? "arrow" : "back"} label="Retour" />
</button> -->
{/if}

{#if $page.state.zoom}
<NoScroll />
<ZoomPage data={$page.state.zoom} onClose={() => {
  history.back()
}} />
{/if}

{#if $page.state.zoomArchive}
<NoScroll />
<ZoomArchivePage data={$page.state.zoomArchive} onClose={() => {
  history.back()
}} />
{/if}

{#if $page.state.video}
<NoScroll />
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

    &:focus {
      outline: none;
    }

    &.vertical {
      top: auto;
      bottom: 0;
      height: min(95dvh, 95vh);
      width: 100vw;

      border-top-right-radius: $gap;
      border-bottom-left-radius: 0;
    }

    color: currentColor;
    border: none;
    background-color: transparent;

    &.half {
      width: 50vw;

      @media (orientation: portrait) {
        width: 100vw;
      }
    }

    @media (max-width: $tablet_landscape) {
      width: 95vw;
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
    position: absolute;
    top: $gap;
    left: $gap;
    z-index: 2001;
    transition: transform 333ms;

    &.vertical {
      top: $mobile_gap;
    }

    // &.half {
    //   left: calc(50vw + ($gap));

    //   @media (orientation: portrait) {
    //     left: calc(0px + ($mobile_gap));
    //   }
    // }

    &:hover,
    &:focus {
      transform: translateX(20%);

      &.vertical {
        transform: translateY(20%);
      }
    }

    @media (orientation: portrait) {
      left: $mobile_gap;
    }
  }

  .last {
    background-color: $beige !important;
    padding: $mobile_gap $mobile_gap ($mobile_gap * 2);
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: $mobile_gap * 0.5;

    dialog:not(.half) & {
      @media (min-width: $mobile) {
        padding-left: 50%;
      }
    }

    dialog.half & {
      justify-content: flex-start;
      margin-top: ($gap * -4.5);
      padding: 0 ($gap * 6) ($gap * 2);

      @media (max-width: $mobile) {
        justify-content: center;
        margin-top: ($mobile_gap * -4.5);
        padding: 0 $mobile_gap ($mobile_gap * 2);
      }
    }

    :global(svg) {
      height: 24px;
      width: 24px;
    }
  }
</style>