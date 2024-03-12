<script lang="ts">
  // import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  import Slider from '$lib/components/Slider.svelte'
  import Tableau from '$lib/components/Tableau.svelte'
  import Lignes from '$lib/components/Lignes.svelte'
  export let data: PageData

  export let retour = false
</script>

<section class="flex flex--thick_gapped {data.format || "images"}">
  <header class="col col--12of12">
    {#if !retour}
    <a href="/">Accueil</a>
    {:else}
    <span></span>
    {/if}
    <h1>{data.ligne.fields.titre}</h1>
  </header>

  <nav class="col col--6of12">
    <Lignes current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} format={data.format} />
  </nav>
  <nav class="col formats" style:--current-color={data.ligne.fields.couleur}>
    <a href="/lignes/{data.ligne.fields.id}?format=images">Images</a>
    <div class:right={data.format === "liste"}></div>
    <a href="/lignes/{data.ligne.fields.id}?format=liste">Liste</a>
  </nav>

  {#if data.format === "liste"}
  <main class="col col--12of12">
    <Tableau ligne={data.ligne} oeuvres={data.ligne.fields.oeuvres} />
  </main>
  {:else}
  <main class="col col--12of12">
    <Slider loop={false} buttons={false} autoplay={false} autoheight={false}>
      {#key data.ligne.fields.id}
      <ol class="slider__container">
      {#each data.ligne.fields.oeuvres as oeuvre, i}
        <li class="slide">
          <a href="/oeuvres/{oeuvre.fields.id}" on:click={openDialog}>
          <figure>
            <div></div>
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
            <figcaption class="annee"><h2 class="h1">{oeuvre.fields.annee}</h2></figcaption>
          </figure>
          </a>
        </li>
      {/each}
      </ol>
      {/key}
    </Slider>
  </main>
  {/if}
</section>


<style lang="scss">
  section {
    padding: $gap;

    ol {
      list-style: none;
    }

    &.images {
      nav {
        order: 99;
      }

      main {
        margin: 0 ($gap * -1);
      }

      ol {
        li {
          figure {
            position: relative;
            display: flex;
            gap: $gap;
            justify-content: center;
            height: calc(100vh - ($gap * 13));

            :global(img),
            :global(video) {
              width: auto;
              height: 100%;
              object-fit: contain;
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

              &.annee {
                position: absolute;
                top: calc(100% + ($gap));
                left: 50%;
                transform: translateX(-50%);

                .h1 {
                  font-size: 13vh;
                }
              }
            }
          }
        }
      }
    }


    nav {
      &.formats {
        display: flex;
        gap: $base * 0.5;
        margin-left: auto;
        align-self: center;

        > div {
          position: relative;
          width: $gap * 2.5;
          height: $base;
          border: 1.5px solid;
          border-radius: $base;

          &:before {
            content: "";
            background-color: var(--current-color);
            border-radius: 50%;
            width: $gap * 0.5;
            height: $gap * 0.5;
            margin: $gap * 0.1;
            position: absolute;
            left: 0;
            top: 0;
          }

          &.right {
            &:before {
              left: auto;
              right: 0;
            }
          }
        }
      }
    }
  }
</style>