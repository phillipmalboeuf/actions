<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import type { MouseEventHandler } from 'svelte/elements'

  import Icon from '$lib/components/Icon.svelte'

  import type { PageData } from './$types' 
  import Transcription from '$lib/components/Transcription.svelte';
  export let data: PageData

  export let onClose: MouseEventHandler<HTMLAnchorElement> = undefined
  let transcription = false

  onMount(() => {
    browser && document.documentElement.classList.add('noscroll')
  })

  onDestroy(() => {
    browser && document.documentElement.classList.remove('noscroll')
  })
</script>

<dialog transition:fly={{ opacity: 1, y: '-100%', duration: 666 }}>
  <a href="/lignes/{data.ligne.fields.id}" role="button" tabindex="0" on:click={(e) => {
    if (onClose) {
      e.preventDefault()
      onClose(e)
    }
  }}><Icon i="close" label="Fermer" /></a>
  <Transcription body={data.ligne.fields.transcriptionVideo} />
  <div>
    <iframe src={data.ligne.fields.lienVimeo ? data.ligne.fields.lienVimeo : "https://www.youtube.com/embed/nbWzqumlcK0?si=_BXSld-HTxc565iJ"} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
</dialog>

<style lang="scss">
  dialog {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: $vh;
    overflow: hidden;
    
    z-index: 3000;
    border: none;

    color: $white;
    background-color: $black;
    padding: ($gap * 4) ($gap * 2) ($gap * 2);

    iframe {
      width: 100%;
      height: calc($vh - ($gap * 6));
    }

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