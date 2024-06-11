<script lang="ts">
  import { type EmblaCarouselType } from 'embla-carousel'

  // import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  export let data: PageData
</script>

<!-- <header>
  {#if !retour}
  <a href="/lignes/{data.ligne.fields.id}">Retour</a>
  {:else}
  <span></span>
  {/if}
</header> -->

<aside>
  <Media media={data.ligne.fields.logotype} />

  <Document body={data.ligne.fields.contexte} />

  <figure>
    <Icon i="play" label="Visionner vidéo" />
    <Media media={data.ligne.fields.vignette} />
  </figure>
</aside>


<style lang="scss">
  // header a {
  //   padding: $gap;
  // }

  aside {
    display: flex;
    flex-direction: column;
    gap: $gap;
    padding: $gap * 6;
    background-color: $beige;

    :global(> picture) {
      margin-bottom: ($gap * 2);

      &:first-child {
        display: block;
        height: 20vh;

        :global(img) {
          height: 100%;
          object-fit: contain;
          object-position: left;
        }
      }
    }

    :global(> figure) {
      position: relative;
      margin-top: ($gap * 2);

      :global(svg) {
        position: absolute;
        top: $base;
        left: $base;
        color: $beige;
        opacity: 0.88;
      }
    }

    @media (max-width: $mobile) {
      padding: ($mobile_gap * 6) $mobile_gap;
    }
  }
</style>