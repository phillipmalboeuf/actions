<script lang="ts">
  import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'
  import { pushState } from '$app/navigation'

  import Content from '$lib/components/Content.svelte'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  
  export let data: PageData
</script>

<section class="flex flex--gapped">
  <header>
    <!-- <a href="/"><h3>Accueil</h3></a> -->
    {#if data.page.fields.logotype}
    <figure role="heading" aria-level="1" class:bigger={['a-propos', 'bibliographie'].includes(data.page.fields.id)}>
      <Media media={data.page.fields.logotype} />
    </figure>
    {:else}
    <h1>{data.page.fields.titre}</h1>
    {/if}
  </header>

  <main>
    <Content content={data.page.fields.contenu} format={data.page.fields.format} />
  </main>
</section>


<style lang="scss">
  section {
    padding: ($gap * 2) ($gap * 2);
    min-height: 100vh;
    // justify-content: space-around;

    :global(.-pages-credits) &,
    :global(.-pages-bibliographie) & {
      --background: #{$yellow};
      background-color: var(--background);
    }

    @media (max-width: $mobile) {
      padding: $mobile_base;
    }

    header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      display: flex;
      justify-content: flex-end;
      text-transform: lowercase;

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
        // width: 50%;
        margin-right: ($gap * 8);
        margin-top: -5px;
        max-height: 140px;

        :global(img) {
          height: 100%;
          object-fit: contain;
          object-position: right;
        }

        &.bigger {
          :global(img) {
            height: 125%;
          }
        }
      }
    }

    main {
      display: flex;
      flex-direction: column;
      gap: $gap;
      margin: auto;

      margin-top: ($gap * 10);
    }
  }

</style>