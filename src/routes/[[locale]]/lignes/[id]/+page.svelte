<script lang="ts">
  import { type EmblaCarouselType } from 'embla-carousel'

  // import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'
  import Slider from '$lib/components/Slider.svelte'
  import Tableau from '$lib/components/Tableau.svelte'
  import Lignes from '$lib/components/Lignes.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  export let data: PageData

  export let retour = false

  let slider: EmblaCarouselType
  let active: number = 0
</script>

{#key data.format}
<section class="flex flex--thick_gapped {data.format || "gallerie"}" class:first={active === 0}>
  <header class="col col--12of12">
    {#if !retour}
    <a href="/" class="h2">accueil</a>
    {:else}
    <span></span>
    {/if}
    <!-- <h1>{data.ligne.fields.titre}</h1> -->
  </header>

  <nav class="col col--6of12">
    <Lignes current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} format={data.format} />
  </nav>
  <nav class="col formats" style:--current-color={data.ligne.fields.couleur}>
    {#if data.format === "index"}
    <a href="/lignes/{data.ligne.fields.id}?format=gallerie" class="button">Gallerie</a>
    {:else}
    <a href="/lignes/{data.ligne.fields.id}?format=index" on:click={() => active = 0} class="button">Index</a>
    {/if}
    <a href="/lignes/{data.ligne.fields.id}/contexte" on:click={openDialog} class="button">Contexte</a>
  </nav>

  {#if data.format === "index"}
  <main class="col col--12of12">
    <Tableau ligne={data.ligne} oeuvres={data.ligne.fields.oeuvres} />
  </main>
  {:else}
  <main class="col col--12of12">
    <Slider loop={false} buttons={false} autoplay={false} autoheight={false} slidesPerView={1.15} bind:slider bind:active>
      {#key data.ligne.fields.id}
      <ol class="slider__container">
        <li class="slide">
          <Document body={data.ligne.fields.contexte} />
          <figure>
            <Media media={data.ligne.fields.logotype} />
          </figure>
        </li>
        {#each data.ligne.fields.oeuvres as oeuvre, i}
        <li class="slide">
          <a href="/oeuvres/{oeuvre.fields.id}" on:click|preventDefault={e => {
            console.log(i, active)
            if (i !== active - 1) {
              slider.scrollTo(i + 1)
            } else {
              openDialog(e)
            }
          }}>
          <figure>
            <!-- <div></div> -->
            <Media media={oeuvre.fields.vignette} />
            <figcaption>
              <h5>{oeuvre.fields.description}</h5>
              <p>
                {oeuvre.fields.artiste.fields.nom}<br />
                {oeuvre.fields.titre}<br />
                {oeuvre.fields.annee}<br />
                {oeuvre.fields.medium}
              </p>
            </figcaption>
            <!-- <figcaption class="annee"><h2 class="h1">{oeuvre.fields.annee}</h2></figcaption> -->
          </figure>
          </a>
        </li>
        {/each}
      </ol>
      {/key}
    </Slider>
  </main>
  <h1 class="annee">{active > 0 ? data.ligne.fields.oeuvres[active - 1].fields.annee : ''}</h1>
  {/if}
</section>
{/key}

<style lang="scss">
  section {
    padding: $gap;

    ol {
      list-style: none;
    }

    &.gallerie {
      nav,
      .annee {
        order: 99;
        margin-top: $base * -9;
        opacity: 0;
        transform: translateY(100%);
        transition: transform 666ms, opacity 666ms;
      }

      &:not(.first) {
        nav {
          opacity: 1;
          transform: translateY(0%);
        }

        .annee {
          opacity: 1;
          transform: translate(-50%, 0%);
        }
      }

      main {
        width: calc(100% + ($gap * 2));
        margin: 0 ($gap * -1);
      }

      .annee {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        font-size: 13vh;
      }

      ol {
        li {
          // padding-bottom: 10vh;

          figure {
            position: relative;
            display: flex;
            gap: $gap;
            justify-content: center;
            height: calc(100vh - ($base * 13));

            :global(img),
            :global(video) {
              width: auto;
              height: 100%;
              object-fit: contain;
              -webkit-user-select: none;
              user-select: none;
              
              padding: 5vh;
              padding-right: 0;
              object-position: right;
            }

            div {
              width: 15%;
            }

            figcaption {
              align-self: center;
              width: 15%;

              h5 {
                margin-bottom: $base;
              }

              // &.annee {
              //   position: absolute;
              //   top: calc(100% + ($gap));
              //   left: 50%;
              //   transform: translateX(-50%);

              //   .h1 {
              //     font-size: 13vh;
              //   }
              // }
            }
          }

          &:first-child {
            padding: $gap;
            height: calc(100vh - ($base * 5));
            display: flex;
            gap: $base;
            flex-direction: column;

            :global(p) {
              max-width: 572px;
            }

            figure {
              height: auto;
              margin-top: auto;
              justify-content: flex-start;
              margin-bottom: $base;

              :global(img) {
                width: 50vw;
                background-color: transparent;
                padding: 0;
              }
            }
          }
        }
      }
    }


    nav {
      &.formats {
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: $base * 0.5;
        margin-left: auto;
        align-self: top;

        // > div {
        //   position: relative;
        //   width: $gap * 2.5;
        //   height: $base;
        //   border: 1.5px solid;
        //   border-radius: $base;

        //   &:before {
        //     content: "";
        //     background-color: var(--current-color);
        //     border-radius: 50%;
        //     width: $gap * 0.5;
        //     height: $gap * 0.5;
        //     margin: $gap * 0.1;
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //   }

        //   &.right {
        //     &:before {
        //       left: auto;
        //       right: 0;
        //     }
        //   }
        // }
      }
    }
  }
</style>