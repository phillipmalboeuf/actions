<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'

  import OeuvrePage from '../../routes/[[locale]]/oeuvres/[id]/+page.svelte'
  import Icon from './Icon.svelte';
  // import ContactPage from '../../routes/[[locale]]/contact/+page.svelte'
</script>

{#if $page.state.open}
<dialog transition:fly={{ opacity: 1, x: '100%', duration: 666 }}>

  <button on:click={() => history.back()}>
    <Icon i="back" label="Retour" />
  </button>

  {#if $page.state.type === 'oeuvre'}
  <OeuvrePage data={$page.state.open} />
  <!-- {:else if $page.state.type === 'page'}
  <Page data={$page.state.open} /> -->
  {/if}

  
</dialog>
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
    width: 95vw;
    z-index: 2000;
    border: none;
    border-top-left-radius: $base * $scale;
    border-bottom-left-radius: $base * $scale;

    // color: var(--color);
    background-color: transparent;

    > button {
      position: fixed;
      top: $base * $scale;
      left: calc(5vw + ($base * $scale));
      z-index: 2001;
      background: none;
      padding: 0;
    }
  }
</style>