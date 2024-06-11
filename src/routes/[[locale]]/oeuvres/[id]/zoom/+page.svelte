<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import type { MouseEventHandler } from 'svelte/elements'
  import Zoom from '$lib/components/Zoom.svelte'
  import Icon from '$lib/components/Icon.svelte'

  import { imigx } from '$lib/formatters'

  import type { PageData } from './$types' 
  export let data: PageData

  export let onClose: MouseEventHandler<HTMLAnchorElement> = undefined
  // let ready = false

  onMount(() => {
    browser && document.documentElement.classList.add('noscroll')
  })

  onDestroy(() => {
    browser && document.documentElement.classList.remove('noscroll')
  })
</script>

<dialog transition:fly={{ opacity: 1, y: '-100%', duration: 666 }}>
  <a href="/oeuvres/{data.oeuvre.fields.id}" on:click={(e) => {
    if (onClose) {
      e.preventDefault()
      onClose(e)
    }
  }}><Icon i="close" label="Fermer" /></a>
  <div>
    <Zoom oeuvre={data.oeuvre} file={{
      url: imigx(((data.oeuvre.fields.media && data.oeuvre.fields.media[data.i || 0]) || data.oeuvre.fields.vignette).fields.file.url),
      width: ((data.oeuvre.fields.media && data.oeuvre.fields.media[data.i || 0]) || data.oeuvre.fields.vignette).fields.file.details.image.width,
      height: ((data.oeuvre.fields.media && data.oeuvre.fields.media[data.i || 0]) || data.oeuvre.fields.vignette).fields.file.details.image.height,
    }} />
  </div>
</dialog>

<style lang="scss">
  dialog {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    
    z-index: 3000;
    border: none;

    color: $white;
    background-color: $black;
    // padding: ($base * $scale * 4) ($base * $scale * 2) ($base * $scale * 2);

    > a {
      display: flex;
      position: absolute;
      top: $base;
      left: ($gap * 2);
      z-index: 4001;
      background: none;
      padding: 0;
      color: $white;
      // margin-bottom: $gap;
      background-color: fade-out($black, 0.33);
      padding: $base * 0.5;
      border-radius: 50%;

      @media (max-width: $mobile) {
        left: ($mobile_gap * 1);
      }
    }
  }
</style>