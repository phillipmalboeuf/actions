<script lang="ts">
  import { fly } from 'svelte/transition'
  import type { Document as ContentfulDocument } from '@contentful/rich-text-types'
  
  import Icon from './Icon.svelte'
  import Document from '$lib/components/document/index.svelte'
  import { languageTag } from '$lib/paraglide/runtime'

  export let visible: boolean = false
  export let body: ContentfulDocument
</script>

<button class="button--transcription" aria-expanded={visible ? "true" : "false"} aria-controls="transcription" on:click={(e) => {
  visible = !visible
}} aria-label={languageTag() === "en" ? "Read the transcription" : "Lire la transcription"}>transcription</button>

{#if visible}
<aside transition:fly={{ opacity: 1, x: '100%', duration: 666 }} id="transcription" class:visible={visible}>
  <button class="button--none" on:click={() => visible = false}><Icon i="back" label={languageTag() === "en" ? "Close the transcription" : "Fermer la transcription"}/></button>
  {#if body}
  <Document body={body} />
  {:else}
  <p>{languageTag() === "en" ? "No transcription available for this video." : "Aucune transcription disponible pour cette vidéo."}</p>
  {/if}
</aside>
{/if}

<style lang="scss">
  .button--transcription {
    position: absolute;
    top: $gap;
    right: $gap * 2;
    z-index: 3999;
  }

  aside {
    padding: calc($gap * 2);
    padding-top: calc($gap * 4);
    background-color: $beige-dark;
    color: $black;
    border-radius: $base;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    
    position: fixed;
    top: 0;
    right: 0;
    z-index: 4000;
    width: calc(90vw);
    max-width: 420px;
    height: 100lvh;
    overflow-y: auto;

    .button--none {
      position: absolute;
      top: $gap;
      left: $gap;
    }

    // transition: transform 0.333s;
    // transform: translateX(100%);
  }
</style>