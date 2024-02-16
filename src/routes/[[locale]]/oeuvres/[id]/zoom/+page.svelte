<script lang="ts">
  import { fade } from 'svelte/transition'
  import Zoom from '$lib/components/Zoom.svelte'
  import Icon from '$lib/components/Icon.svelte'

  import type { PageData } from './$types' 
  export let data: PageData
</script>

<dialog transition:fade={{ duration: 666 }}>
  <a href="/oeuvres/{data.oeuvre.fields.id}"><Icon i="close" label="Fermer" /></a>
  <Zoom file={{
    url: `/examples/25.png`,
    width: 3582,
    height: 6571
  }} />
</dialog>

<style lang="scss">
  dialog {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    
    z-index: 3000;
    border: none;

    color: $white;
    background-color: $black;
    padding: ($base * $scale * 4) ($base * $scale * 2) ($base * $scale * 2);

    > a {
      display: block;
      position: fixed;
      top: $base;
      left: ($base * $scale * 2);
      z-index: 2001;
      background: none;
      padding: 0;
      margin-bottom: $base * $scale;
    }
  }
</style>