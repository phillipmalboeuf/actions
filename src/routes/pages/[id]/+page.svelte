<script lang="ts">
  import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'

  import Content from '$lib/components/Content.svelte'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  
  export let data: PageData
</script>

<section class="flex flex--gapped">
  <header>
    <!-- <a href="/"><h3>Accueil</h3></a> -->
    {#if data.page.fields.logotype}
    <figure role="heading" aria-level="1">
      <Media media={data.page.fields.logotype} />
    </figure>
    {:else}
    <h1>{data.page.fields.titre}</h1>
    {/if}
  </header>

  <article>
    <Content content={data.page.fields.contenu} format={data.page.fields.format} />
  </article>
</section>


<style lang="scss">
  section {
    padding: ($gap * 2) ($gap * 2);
    min-height: $vh;
    // justify-content: space-around;

    :global(.-pages-credits) &,
    :global(.-pages-bibliographie) &,
    :global(.-en-pages-bibliographie) &,
    :global(.-en-pages-credits) & {
      --background: #{$yellow};
      background-color: var(--background);
    }

    @media (max-width: $mobile) {
      padding: 0;
    }

    header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      display: flex;
      justify-content: flex-end;
      text-transform: lowercase;

      @media (max-width: $tablet_landscape) {
        position: static;
        padding: 0 $mobile_base;
        margin-top: $mobile_gap * 6;
      }

      // > a {
      //   padding: $base;

      //   h3 {
      //     font-family: $display;
      //     font-weight: 300;
      //   }
      // }

      h1 {
        font-size: $base * 8;
        width: 50%;
        text-align: right;
        margin-right: ($gap * 8);
        margin-top: ($gap * -1) - 5px;
      }

      figure {
        height: 140px;

        @media (max-width: $tablet_landscape) {
          margin-top: ($mobile_gap * 3);
          height: 70px;
        }

        @media (min-width: $tablet_landscape) {
          margin-right: ($gap * 8);
          margin-top: -5px;
        }

        :global(img) {
          height: 100%;
          object-fit: contain;
          object-position: right;

          @media (max-width: $tablet_landscape) {
            object-position: left;
          }
        }

        // &.bigger {
        //   :global(img) {
        //     height: 125%;
        //   }
        // }
      }
    }

    article {
      display: flex;
      flex-direction: column;
      gap: $gap;
      margin: auto;

      @media (min-width: $tablet_landscape) {
        margin-top: ($gap * 10);
      }

      @media (max-width: $mobile) {
        margin: 0;
      }
    }
  }

</style>