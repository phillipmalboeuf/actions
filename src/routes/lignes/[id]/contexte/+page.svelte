<script lang="ts">
  import { type EmblaCarouselType } from 'embla-carousel'
  import { languageTag } from '$lib/paraglide/runtime'

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

<svelte:head>
	<title>{data.ligne.fields.titre}</title>
  {#if data.ligne.fields.descriptionContexte}
  <meta name="description" content={data.ligne.fields.descriptionContexte} />
  {/if}
</svelte:head>

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
    <a href="/lignes/{data.ligne.fields.id}/video" class="video" on:click={openDialog}>
      <Icon i="play" label="Visionner vidéo" />
      <Media media={data.ligne.fields.vignette} />
      {#if data.ligne.fields.vignetteVideo}
      <Media media={data.ligne.fields.vignetteVideo} eager small />
      {/if}
    </a>
  </figure>

  {#if !dialog}
  <a class="last" href="/lignes/{data.ligne.fields.id}">
    <Icon i={"back"} label="Retour" /> {languageTag() === "en" ? "Back to the time line" : "Revenir à la ligne du temps"}
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

    > figure {
      margin-top: ($gap * 2);
    }

    a.video {
      position: relative;

      :global(svg) {
        position: absolute;
        z-index: 4;
        top: $base * 0.75;
        left: $base * 0.75;
        color: $beige;
        opacity: 0.88;
        width: $base * 2.5;
        height: $base * 2.5;

        @media (max-width: $mobile) {
          top: $mobile_base * 0.75;
          left: $mobile_base * 0.75;
        }
      }

      :global(picture + video),
      :global(picture + picture) {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        transition: opacity 0.333s;
      }

      &:hover,
      &:focus {
        :global(picture + video),
        :global(picture + picture) {
          opacity: 1;
        }
      }
    }

    @media (max-width: $tablet_landscape) {
      padding: ($gap * 6) ($gap * 2);
    }

    @media (max-width: $tablet_portrait) {
      padding: ($gap * 6) ($gap);
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