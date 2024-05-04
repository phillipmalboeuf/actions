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
  {#if data.format === "index"}
  <header class="col col--12of12">
    <figure>
      <Media media={data.ligne.fields.logotype} />
    </figure>
  </header>
  {/if}

  <nav class="col col--6of12">
    <Lignes current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} format={data.format} />
  </nav>
  <nav class="col formats" style:--current-color={data.ligne.fields.couleur}>
    {#if data.format === "index"}
    <a href="/lignes/{data.ligne.fields.id}?format=gallerie" class="button" style:--color={data.ligne.fields.couleur}>Gallerie</a>
    {:else}
    <a href="/lignes/{data.ligne.fields.id}?format=index" on:click={() => active = 0} class="button" style:--color={data.ligne.fields.couleur}>Index</a>
    {/if}
    <a href="/lignes/{data.ligne.fields.id}/contexte" on:click={openDialog} class="button" style:--color={data.ligne.fields.couleur}>Contexte</a>
  </nav>

  {#if data.format === "index"}
  <main class="col col--12of12">
    <Tableau ligne={data.ligne} oeuvres={data.ligne.fields.oeuvres} />
  </main>
  {:else}
  <main class="col col--12of12">
    <Slider loop={false} buttons={false} autoplay={false} autoheight={false} slidesPerView={1} bind:slider bind:active>
      {#key data.ligne.fields.id}
      <ol class="slider__container">
        <li class="slide">
          <Document body={data.ligne.fields.contexte} />
          <figure>
            <Media media={data.ligne.fields.logotype} />
          </figure>
        </li>
        {#each data.ligne.fields.oeuvres as oeuvre, i}
        <li class="slide {oeuvre.fields.format}" class:left={active < i + 1} class:right={active > i + 1}>
          <a href="/oeuvres/{oeuvre.fields.id}" on:click|preventDefault={e => {
            if (i !== active - 1) {
              slider.scrollTo(i + 1)
            } else {
              openDialog(e)
            }
          }}>
          <figure>
            <div>
              <Icon i="plus" label="Découvrez" />
            </div>
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
          </figure>
          </a>
        </li>
        {/each}
      </ol>
      {/key}
    </Slider>
  </main>
  <h1 class="annee">{active > 0 ? data.ligne.fields.oeuvres[active - 1].fields.annee : data.ligne.fields.oeuvres[0].fields.annee}</h1>
  {/if}
</section>
{/key}

<style lang="scss">
  section {
    padding: ($gap * 4) ($gap * 2) ($gap * 4);

    header {
      margin: ($gap * 2) 0;
      
      figure :global(img) {
        width: auto;
        height: 140px;
        object-fit: contain;
      }
    }

    ol {
      list-style: none;
    }

    &.index {
      padding-bottom: ($gap * 14);
    }

    &.gallerie {
      nav,
      .annee {
        z-index: 2;
        order: 99;
        margin-top: $base * -9;
        opacity: 0;
        transform: translateY(100%);
        transition: transform 666ms, opacity 666ms;
      }

      .annee {
        position: absolute;
        bottom: $base * -1;
        left: 50%;
        transform: translate(-50%, 100%);
        font-size: $base * 10;
        letter-spacing: -0.01em;
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
        width: calc(100% + ($gap * 4));
        margin-left: ($gap * -2);
      }

      ol {
        li {
          display: flex;
          flex-direction: column;

          // transition: transform 666ms;
          // &.left { transform: translateX(-25%); }
          // &.right { transform: translateX(25%); }

          &.left, &.right {
            figcaption {
              opacity: 0;
            }
          }

          figure {
            position: relative;
            display: flex;
            gap: $gap;
            justify-content: center;
            height: calc(100vh - ($base * 15));

            :global(img),
            :global(video) {
              width: auto;
              height: 100%;
              object-fit: contain;
              -webkit-user-select: none;
              user-select: none;
            }

            div {
              position: relative;
              width: 15%;

              :global(svg) {
                position: absolute;
                top: 50%;
                right: ($base * -2) - 4px;
                color: $white;
                background-color: $brown;
                width: $base * 2;
                height: $base * 2;
                padding: $base * 0.5;
                border-radius: 50%;
                transform: translateY(-50%);
                opacity: 0;
                transition: opacity 333ms;
              }
            }

            figcaption {
              align-self: center;
              width: 15%;

              transition: opacity 333ms;

              h5 {
                margin-bottom: $base;
              }
            }
          }

          a:hover,
          a:focus {
            div {
              :global(svg) {
                opacity: 1;
              }
            }
          }

          &.Petit,
          &.Moyen {
            a {
              margin: auto 0;
            }
            figure {
              margin-bottom: $base * 10;
            }
          }

          &.Petit {
            figure {
              height: calc(36.66vh);
            }
          }

          &.Moyen {
            figure {
              height: calc(55.55vh);
            }
          }

          &:first-child {
            flex: 0 0 70%;
            padding: ($gap * 3) ($gap * 2) $gap;
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
                height: $base * 13.33;
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