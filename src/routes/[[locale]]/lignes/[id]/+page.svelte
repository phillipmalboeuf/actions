<script lang="ts">
  import { type EmblaCarouselType } from 'embla-carousel'
  import type { Entry } from 'contentful';
  import type { TypeLigneSkeleton } from '$lib/clients/content_types';

  // import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'
  import Slider from '$lib/components/Slider.svelte'
  import Tableau from '$lib/components/Tableau.svelte'
  import Lignes from '$lib/components/Lignes.svelte'
  import Credit from '$lib/components/Credit.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  export let data: PageData

  let slider: EmblaCarouselType
  let active: number = 0
  let scroll: number = 0
  let location: number = 0
  let last: number

  let next: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  let index: number

  $: {
    index = data.lignes.findIndex(l => l.sys.id === data.ligne.sys.id)
    next = data.lignes[index === data.lignes.length - 1 ? 0 : index + 1]
  }
</script>

{#key data.ligne.sys.id}
{#key data.format}
<section class="flex flex--thick_gapped {data.format || "gallerie"}" class:first={active === 0}>
  {#if data.format === "index"}
  <header class="col col--12of12">
    <figure>
      <Media media={data.ligne.fields.logotype} />
    </figure>
  </header>
  {/if}

  <nav class="col selector">
    <Lignes id="exposition-desktop" current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} format={data.format} />
  </nav>
  <nav class="col col--mobile--12of12 formats" style:--current-color={data.ligne.fields.couleur}>
    <Lignes id="exposition-mobile" current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} format={data.format} />

    {#if data.format === "index"}
    <a href="/lignes/{data.ligne.fields.id}?format=gallerie" class="button" style:--color={data.ligne.fields.couleur}>Galerie</a>
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
  <main class="col col--12of12" style:--color={data.ligne.fields.couleur} class:fini={active >= data.ligne.fields.oeuvres.length} style:--scroll={scroll} style:--location={location} style:--last={last}>
    <Slider loop={false} buttons={false} autoplay={false} autoheight={false} slidesPerView={"auto"} bind:slider bind:active bind:scroll bind:location bind:last>
      <!-- {location} {scroll} {last} -->
      {#key data.ligne.fields.id}
      <ol class="slider__container">
        <li class="slide first" class:active={active === 0}>
          <Document body={data.ligne.fields.contexte} />
          <figure>
            <Media media={data.ligne.fields.logotype} />
          </figure>
          <button class="next button--none" on:click={() => slider.scrollNext()}><Icon i="back" label="Prochain" /></button>
        </li>
        {#each data.ligne.fields.oeuvres as oeuvre, i}
        <li class="slide {oeuvre.fields.format}" class:left={(active < i + 1)} class:right={(active > i + 1) && i !== data.ligne.fields.oeuvres.length - 1}>
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
              <h5>{oeuvre.fields.description || oeuvre.fields.titre}</h5>
              <p>
                <Credit {oeuvre} />
              </p>
              <u>Découvrir l'oeuvre</u>
            </figcaption>
          </figure>
          </a>
        </li>
        {/each}

        <li class="slide fin" class:active={active === data.ligne.fields.oeuvres.length}>
          <a href="/lignes/{next.fields.id}" on:click={() => slider.scrollTo(0, true)} style:--color={next.fields.couleur}>
            <Icon i="back" label="Prochain" />
            <p>Visitez la prochaine exposition</p>
            <hr>
            <p>{next.fields.titre}</p>
          </a>
        </li>
      </ol>
      {/key}
    </Slider>
  </main>
  <h1 class="annee">
    <button class="previous button--none" on:click={() => slider.scrollPrev()}><Icon i="next" label="Retour" /></button>
    {active > 0 ? active === data.ligne.fields.oeuvres.length + 1 ? data.ligne.fields.oeuvres[active - 2].fields.annee : data.ligne.fields.oeuvres[active - 1].fields.annee : data.ligne.fields.oeuvres[0].fields.annee}
    <button disabled={active === data.ligne.fields.oeuvres.length + 1} class="next button--none" on:click={() => slider.scrollNext()}><Icon i="next" label="Prochain" /></button>
  </h1>
  {/if}
</section>
{/key}
{/key}

<style lang="scss">
  section {
    padding: ($gap * 4) ($gap * 2) ($gap * 4);

    @media (max-width: $mobile) {
      padding: ($mobile_gap * 6) ($mobile_gap * 1) ($mobile_gap * 3);
    }

    header {
      margin: ($gap * 2) 0;
      
      figure :global(img) {
        width: auto;
        height: 140px;
        object-fit: contain;

        @media (max-width: $mobile) {
          height: 70px;
        }
      }
    }

    ol {
      list-style: none;
    }

    .selector {
      position: relative;
    }

    .formats {

      @media (min-width: $mobile) {
        :global(form) {
          display: none;
        }
      }
    }

    @media (max-width: $mobile) {
      .selector {
        display: none;
      }

      .formats {
        position: relative;
        left: 0;
        right: 0;
        top: 0;
        justify-content: space-between;
      }
    }

    &.index {
      align-items: flex-start;
      padding-bottom: ($gap * 14);
    }

    &.gallerie {
      @media (max-width: $mobile) {
        // --gap: $mobile_gap;
      }

      nav,
      .annee {
        position: absolute;
        bottom: $gap * 6;
        left: $gap * 2;
        z-index: 2;
        order: 99;
        // margin-top: $base * -9;

        pointer-events: none;
        opacity: 0;
        transform: translateY(100%);
        transition: transform 666ms, opacity 666ms;

        @media (max-width: $mobile) {
          position: static;
          transform: none;
          order: -1;

          &:not(.annee) {
            opacity: 1;
            pointer-events: all;
          }
        }
      }

      .formats {
        left: auto;
        right: $gap * 2;
      }

      .annee {
        bottom: $gap * 3;
        left: 50%;
        transform: translate(-50%, 100%);
        font-size: $base * 10;
        letter-spacing: -0.01em;

        button {
          transform: translateY(-$gap * 2);
          
          // :global(svg) {
          //   width: $base * 3;
          // }

          &.previous {
            transform: translateY(-$gap * 2) scaleX(-1);
          }

          &[disabled] {
            pointer-events: none;
            opacity: 0.5;
          }

          @media (max-width: $mobile) {
            // display: none;
            transform: translateY(-$mobile_gap * 1);

            &.previous {
              transform: translateY(-$mobile_gap * 1) scaleX(-1);
            }
          }
        }

        @media (max-width: $mobile) {
          font-size: $mobile_base * 7;
          order: 99;
          margin: ($mobile_base * -1) auto 0;
          transform: translate(0%, 100%);
        }
      }

      &:not(.first) {
        nav {
          opacity: 1;
          transform: translateY(0%);
          pointer-events: all;
        }

        .annee {
          opacity: 1;
          transform: translate(-50%, 0%);
          pointer-events: all;

          @media (max-width: $mobile) {
            transform: none;
          }
        }
      }

      main {
        width: calc(100% + ($gap * 4));
        margin-left: ($gap * -2);

        @media (max-width: $mobile) {
          width: calc(100% + ($mobile_gap * 2));
          margin-left: ($mobile_gap * -1);
        }
      }

      ol {
        // transition: transform 666ms;
        li {
          display: flex;
          flex-direction: column;
          // transition: transform 33ms;

          &.left, &.right {
            figcaption {
              opacity: 0;
            }
          }

          @media (max-width: $mobile) {
            flex: 0 0 80%;
          }

          figure {
            position: relative;
            display: flex;
            gap: $gap;
            justify-content: center;
            height: calc($vh - ($base * 15));

            @media (max-width: $mobile) {
              gap: $mobile_base;
              max-width: 100vw;
              height: auto;
              padding: 0 $mobile_gap;
              flex-direction: column;
            }

            :global(img),
            :global(video) {
              width: auto;
              height: 100%;
              object-fit: contain;
              -webkit-user-select: none;
              user-select: none;

              @media (max-width: $mobile) {
                height: 50vh;
                width: 100%;
              }
            }

            div {
              position: relative;
              width: 12vw;

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

              @media (max-width: $mobile) {
                display: none;
              }
            }

            figcaption {
              align-self: center;
              width: 12vw;

              transition: opacity 333ms;

              h5 {
                margin-bottom: $base;
              }

              @media (min-width: $mobile) {
                u {
                  display: none;
                }
              }

              @media (max-width: $mobile) {
                width: 100%;
                text-align: center;

                p {
                  display: none;
                }
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

          &:last-child {
            // flex: 0 0 100%;
          }

          &.first {
            flex: 0 0 80%;
            // min-width: 70vw;
            padding: ($gap * 3) ($gap * 2) $gap;
            height: calc($vh - ($base * 5));
            display: flex;
            gap: $base;
            flex-direction: column;

            @media (max-width: $mobile) {
              height: auto;
              padding-left: ($mobile_gap * 1);
            }

            :global(p) {
              max-width: 572px;

              @media (max-width: $mobile) {
                display: none;
              }
            }

            button {
              position: absolute;
              bottom: ($base * 10);
              right: ($base * 10);
              transition: opacity 333ms;
              opacity: 1;

              @media (max-width: $mobile) {
                left: $mobile_gap * 1.5;
                right: auto;
                bottom: ($mobile_base * 15);
              }
            }

            &:not(.active) button {
              opacity: 0;
            }

            figure {
              height: auto;
              margin-top: auto;
              justify-content: flex-start;
              margin-bottom: $base;

              :global(img) {
                height: 20vh;
                background-color: transparent;
                padding: 0;
              }

              @media (max-width: $mobile) {
                padding: 0;
                width: auto;
              }
            }
          }

          &.fin {
            position: relative;
            z-index: 2;
            flex: 0 0 33%;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: $gap * 6;

            @media (max-width: $mobile) {
              flex: 0 0 40%;
              padding-bottom: $mobile_gap * 5;
            }

            a {
              background-color: var(--color);
              padding: ($base * 0.75) ($base * 0.5) ($base * 0.75);
              border-bottom-left-radius: $base * 0.5;
              border-top-left-radius: $base * 0.5;
              width: 120px;
              font-size: $base - 2px;

              :global(svg) {
                display: block;
                width: 37px;
                height: 37px;
                border: 1px solid;
                border-radius: 50%;
                padding: $base * 0.25;
                margin-bottom: $gap;
              }

              hr {
                margin: ($gap * 3) 0 ($base * 0.75);
              }
            }
          }
        }
      }

      .fini {
        ol {
          transform: translate3d(calc(((var(--location) + max(calc(var(--last) - var(--scroll)), 0)) * 1px)), 0px, 0px) !important;

          li.fin {
            transform: translateX(calc(max(calc(var(--last) - var(--scroll)), 0) * -1px));
          }
        }
      }
    }


    nav {
      &.formats {
        z-index: 20;
        display: flex;
        gap: $base * 0.5;
        align-self: top;

        @media (min-width: $mobile) {
          flex-direction: column;
          margin-left: auto;
        }

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