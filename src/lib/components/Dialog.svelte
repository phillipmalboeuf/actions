<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'

  import OeuvrePage from '../../routes/[[locale]]/oeuvres/[id]/+page.svelte'
  import ContextePage from '../../routes/[[locale]]/lignes/[id]/contexte/+page.svelte'
  import ZoomPage from '../../routes/[[locale]]/oeuvres/[id]/zoom/+page.svelte'
  import Icon from './Icon.svelte'
  // import ContactPage from '../../routes/[[locale]]/contact/+page.svelte'
</script>

{#if $page.state.type && $page.state.open}
<dialog transition:fly={{ opacity: 1, x: '100%', duration: 666 }} class:half={$page.state.type === 'contexte'}>
  {#if $page.state.type === 'oeuvre'}
  <OeuvrePage data={$page.state.open} retour />
  {:else if $page.state.type === 'contexte'}
  <ContextePage data={$page.state.open} retour />
  {/if}
</dialog>
<button class="back" transition:fade={{ duration: 666 }} on:click={() => history.back()}>
</button>
<button class="close" class:half={$page.state.type === 'contexte'} transition:fly={{ opacity: 1, x: '100vw', duration: 666 }} on:click={() => history.back()}>
  <Icon i="back" label="Retour" />
</button>
{/if}

{#if $page.state.zoom}
<ZoomPage data={$page.state.zoom} onClose={() => {
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
    height: 100vh;
    overflow-y: auto;
    width: 90vw;
    z-index: 2000;
    border: none;
    border-top-left-radius: $base * $scale;
    border-bottom-left-radius: $base * $scale;

    color: currentColor;
    border: none;
    background-color: transparent;

    &.half {
      width: 50vw;
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
    top: $base * $scale;
    left: calc(10vw + ($base * $scale));
    z-index: 2001;
    background: none;
    padding: 0;
    border: none;
    transition: transform 333ms;

    &.half {
      left: calc(50vw + ($base * $scale));
    }

    &:hover,
    &:focus {
      transform: translateX(20%);
    }
  }
</style>