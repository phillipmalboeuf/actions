<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import type { MouseEventHandler } from 'svelte/elements'
  import Zoom from '$lib/components/Zoom.svelte'
  import Icon from '$lib/components/Icon.svelte'

  import type { PageData } from './$types' 
  export let data: PageData

  export let onClose: MouseEventHandler<HTMLAnchorElement> = undefined
  let ready = false
</script>

<dialog transition:fly={{ opacity: 1, y: '-100%', duration: 666 }} on:introend={() => ready = true}>
  <a href="/oeuvres/{data.oeuvre.fields.id}" on:click={(e) => onClose(e)}><Icon i="close" label="Fermer" /></a>
  {#if ready}
  <div transition:fade={{ duration: 333 }}>
    <Zoom file={{
      url: `/examples/25.png`,
      width: 3582,
      height: 6571
    }} />
  </div>
  {/if}
</dialog>

<style lang="scss">
  dialog {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    
    z-index: 3000;
    border: none;

    color: $white;
    background-color: $black;
    padding: ($base * $scale * 4) ($base * $scale * 2) ($base * $scale * 2);

    > a {
      display: block;
      position: absolute;
      top: $base;
      left: ($base * $scale * 2);
      z-index: 4001;
      background: none;
      padding: 0;
      color: $white;
      margin-bottom: $base * $scale;
    }
  }
</style>