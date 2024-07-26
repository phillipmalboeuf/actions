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
  export let dialog = false
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
    <a href="/lignes/{data.ligne.fields.id}/video" on:click={openDialog}>
      <Icon i="play" label="Visionner vidéo" />
      <Media media={data.ligne.fields.vignette} />
    </a>
  </figure>

  {#if !dialog}
  <a class="last" href="/lignes/{data.ligne.fields.id}">
    <Icon i={"back"} label="Retour" /> Revenir à la ligne du temps
  </a>
  {/if}
</aside>


<style lang="scss">
  // header a {
  //   padding: $gap;
  // }

  aside {
    max-width: $tablet_portrait;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $gap;
    padding: $gap * 6;
    background-color: $beige;

    > :global(p),
    > :global(ul p),
    > :global(ol p),
    > :global(blockquote > p) {
      font-size: $base;
    }

    :global(> picture) {
      margin-bottom: ($gap * 2);

      &:first-child {
        display: block;
        height: 148px;

        @media (max-width: $mobile) {
          height: 99px;
        }

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

  .last {
    padding: $mobile_gap $mobile_gap ($mobile_gap * 2);
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: $mobile_gap * 0.5;

    :global(svg) {
      height: 24px;
      width: 24px;
    }
  }
</style>