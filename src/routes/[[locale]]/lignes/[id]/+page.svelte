<script lang="ts">
  import { type EmblaCarouselType } from 'embla-carousel'
  import type { Entry } from 'contentful'
  import type { TypeLigneSkeleton } from '$lib/clients/content_types'

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
  import { fade, crossfade } from 'svelte/transition'
  import { tick } from 'svelte'
  import { onNavigate } from '$app/navigation'
  
  export let data: PageData

  let slider: EmblaCarouselType
  let active: number
  let scroll: number
  let location: number
  let last: number

  let next: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  let index: number
  let hover: string

  // let ready = true

  onNavigate(async () => {
    // ready = false
    setTimeout(() => {
      slider.scrollTo(active, true)
      // slider.emit("scroll")
      // ready = true
    }, 333)
  })

  $: {
    index = data.lignes.findIndex(l => l.sys.id === data.ligne.sys.id)
    next = data.lignes[index === data.lignes.length - 1 ? 0 : index + 1]
  }
</script>

<svelte:head>
	<title>{data.ligne.fields.titre}</title>
</svelte:head>

{#key data.format}
<section class="flex flex--thick_gapped {data.format || "gallerie"}" class:first={active === 0}>
  {#if data.format === "index"}
  <header class="col col--12of12">
    <figure>
      <Media media={data.ligne.fields.logotype} />
    </figure>
  </header>
  {/if}

  {#if data.format === "index"}
  <div class="col col--12of12">
    <Tableau ligne={data.ligne} oeuvres={data.ligne.fields.oeuvres} on:click={openDialog} />
  </div>
  {:else}
  <div class="col col--12of12" transition:fade={{ duration: 666 }} style:--color={data.ligne.fields.couleur} class:fini={active >= data.ligne.fields.oeuvres.length} style:--scroll={scroll} style:--location={location} style:--last={last}>
    {#key data.ligne.fields.id}
    {#if active !== undefined}
    <aside class="progress flex flex--column">
      <small aria-hidden="true">défiler pour explorer</small>
      <progress max={data.ligne.fields.oeuvres.length + 1} value={active}>{active} / {data.ligne.fields.oeuvres.length + 2}</progress>
    </aside>
    {/if}
    <Slider wheel loop={false} buttons={false} autoplay={false} autoheight={false} slidesPerView={"auto"} bind:slider bind:active bind:scroll bind:location bind:last>
      <!-- {location} {scroll} {last} -->
      <ol class="list--nostyle slider__container">
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
            <aside>
              <button>
                <Icon i="plus" label="Plus" />
                <small>Découvrir</small>
              </button>
            </aside>
            <Media media={oeuvre.fields.vignette} />
            <figcaption>
              <h5>{@html oeuvre.fields.description || oeuvre.fields.titre}</h5>
              <p>
                <Credit {oeuvre} />
              </p>
              <u>Découvrir l’oeuvre</u>
            </figcaption>
          </figure>
          </a>
        </li>
        {/each}

        <li class="slide fin" class:active={active === data.ligne.fields.oeuvres.length}>
          <a href="/lignes/{next.fields.id}" on:click={() => {
            active = 0
            slider.scrollTo(0, true)
          }} style:--color={next.fields.couleur}>
            <Icon i="back" label="Prochain" />
            <p>Visitez la prochaine ligne du temps</p>
            <hr>
            <p>{next.fields.titre}</p>
          </a>
        </li>
      </ol>
    </Slider>
    {/key}

    {#if hover && hover !== data.ligne.fields.id}
    {#await fetch(`/lignes/${hover}/siblings/${active - 1}`) then response}
    {#await response.json() then siblings}
    <aside class="siblings" transition:fade={{ duration: 333 }}>
      <figure class="sibling--previous {siblings.previous?.fields.format}">
        {#if siblings.previous}<Media media={siblings.previous.fields.vignette} />{/if}
      </figure> 
      
      <figure class="sibling--next {siblings.next?.fields.format}">
        {#if siblings.next}<Media media={siblings.next.fields.vignette} />{/if}
      </figure>
    </aside>
    {/await}
    {/await}
    {/if}
  </div>

  <h1 class="annee" role="navigation">
    <button class="previous button--none" on:click={() => slider.scrollPrev()}><Icon i="next" label="Retour" /></button>
    {active > 0 ? active === data.ligne.fields.oeuvres.length + 1 ? data.ligne.fields.oeuvres[active - 2].fields.anneeEvenement : data.ligne.fields.oeuvres[active - 1].fields.anneeEvenement : data.ligne.fields.oeuvres[0].fields.anneeEvenement}
    <button disabled={active === data.ligne.fields.oeuvres.length + 1} class="next button--none" on:click={() => slider.scrollNext()}><Icon i="next" label="Prochain" /></button>
  </h1>
  {/if}

  <nav class="col selector">
    <Lignes id="exposition-desktop" current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} {active} format={data.format}
      on:mouseenter={(e) => {
        // @ts-ignore
        hover = e.currentTarget.getAttribute("data-id")
      }}
      on:mouseleave={() => hover = undefined} />
  </nav>
  <nav class="col col--mobile--12of12 formats" style:--current-color={data.ligne.fields.couleur}>
    <Lignes id="exposition-mobile" current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} format={data.format}
      on:mouseenter={(e) => {
        // @ts-ignore
        hover = e.currentTarget.getAttribute("data-id")
      }}
      on:mouseleave={() => hover = undefined} />

    {#if data.format === "index"}
    <a href="/lignes/{data.ligne.fields.id}?format=gallerie" class="button" style:--color={data.ligne.fields.couleur}>Galerie</a>
    {:else}
    <a href="/lignes/{data.ligne.fields.id}?format=index" on:click={() => active = 0} class="button" style:--color={data.ligne.fields.couleur}>Liste</a>
    {/if}
    <a href="/lignes/{data.ligne.fields.id}/contexte" on:click={openDialog} class="button" style:--color={data.ligne.fields.couleur}>Vidéo</a>
  </nav>
</section>
{/key}

<style lang="scss">
  section {
    padding: ($gap * 4) ($gap * 2) ($gap * 4);

    @media (max-width: $mobile) {
      padding: ($mobile_gap * 4) ($mobile_gap * 1) ($mobile_gap * 3);
    }

    header {
      margin: ($gap * 2) 0;
      
      figure :global(img) {
        width: auto;
        height: 148px;
        object-fit: contain;

        @media (max-width: $mobile) {
          height: 99px;
        }
      }

      @media (max-width: $mobile) {
        margin: ($mobile_gap * 2) 0 ($mobile_gap);

        & ~ .formats {
          margin-bottom: ($mobile_gap);
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

      div {
        order: 99;
      }
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

        @media (max-width: $tablet_portrait) {
          left: $gap * 1;
          bottom: $gap * 5;
        }

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
        bottom: $gap * 5.5;

        @media (max-width: $tablet_portrait) {
          right: $gap * 1;
        }

        @media (max-width: $mobile) {
          position: relative;
          bottom: 0;
          left: 0;
          right: 0;
        }
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

        @media (max-width: $tablet_portrait) {
          font-size: $base * 8;
        }

        @media (max-width: $mobile) {
          font-size: $mobile_base * 5.5;
          order: 99;
          margin: ($base * -2.666) auto 0;
          transform: translate(0%, 100%);
        }
      }

      &:not(.first) {
        nav {
          opacity: 1;
          transform: translateY(0%);
          pointer-events: all;
        }

        .first {
          opacity: 0;
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

      div {
        position: relative;
        width: calc(100% + ($gap * 4));
        margin-left: ($gap * -2);

        @media (max-width: $mobile) {
          width: calc(100% + ($mobile_gap * 2));
          margin-left: ($mobile_gap * -1);
        }

        // opacity: 0;

        // &.ready {
        //   opacity: 1;
        //   transition: opacity 333ms;
        // }

        .progress {
          position: absolute;
          bottom: calc(100% + ($gap * 1.5));
          left: 0%;

          text-align: center;

          progress {
            margin-left: auto;
            margin-right: auto;
            width: $gap * 10;
          }

          @media (max-width: $tablet_portrait) {
            display: none;
          }
        }

        .siblings {
          pointer-events: none;
          position: absolute;
          z-index: -1;
          top: -90px;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          opacity: 0.25;

          figure {
            width: 33%;
            height: calc($vh - ($base * 15));

            :global(img) {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            &.Petit {
              height: calc(40vh);
            }

            &.Moyen {
              height: calc(55vh);
            }

            &.Large {
              height: calc(65vh);
            }
          }
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

            aside button {
              opacity: 0;
            }
          }

          @media (max-width: $mobile) {
            flex: 0 0 80%;
          }

          a {
            pointer-events: none;

            figure :global(img),
            aside button,
            figcaption > * {
              pointer-events: auto;
            }

            &:hover,
            &:focus {
              aside button {
                gap: $base * 0.5;
                small {
                  opacity: 1;
                  width: 60px;
                }
              }
            }
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
              height: calc($vh - ($base * 10));
              padding: $mobile_gap $mobile_gap;
              flex-direction: column;
              justify-content: flex-start;
            }

            :global(img),
            :global(video) {
              width: auto;
              height: 100%;
              object-fit: contain;
              -webkit-user-select: none;
              user-select: none;
              transition: transform 333ms;
              max-width: 66vw;

              @media (min-width: $mobile) {
                // background-color: var(--color);
              }

              @media (max-width: $mobile) {
                max-width: none;
                height: min(50dvh, 50vh);
                width: 100%;
              }
            }

            aside {
              position: relative;
              width: 12vw;
            
              button {
                position: absolute;
                top: 50%;
                left: calc(100% + 3px);

                display: flex;
                align-items: center;
                gap: 0;

                background-color: var(--color, $brown);
                padding: $base * 0.5;
                border: none;

                overflow: hidden;
                opacity: 1;
                transition: opacity 333ms, gap 333ms;

                @media (max-width: $mobile) {
                  display: none;
                }

                small {
                  width: 0;
                  opacity: 0;
                  transition: opacity 333ms, width 333ms;
                }

                :global(svg) {
                  // color: $white;
                  
                  width: $base;
                  height: $base;
                  
                  // opacity: 0;
                  // transition: opacity 333ms;
                }
              }

              // @media (max-width: $mobile) {
              //   display: none;
              // }
            }

            figcaption {
              align-self: center;
              width: 12vw;

              transition: opacity 333ms;

              h5 {
                font-size: $base + 2px;
                margin-bottom: $base;

                @media (max-width: $mobile) {
                  margin-bottom: $mobile_base * 0.5;
                }
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

          &:not(.left):not(.right) {
            a:hover,
            a:focus {
              div {
                :global(svg) {
                  opacity: 1;
                }
              }
            }
          }

          @media (min-width: $mobile) {
          &.Petit,
          &.Moyen,
          &.Large {
            a {
              margin: auto 0;
            }
            figure {
              margin-bottom: $base * 10;
            }
          }

          &.Petit {
            figure {
              height: calc(40vh);
            }
          }

          &.Moyen {
            figure {
              height: calc(55vh);
            }
          }

          &.Large {
            figure {
              height: calc(65vh);
            }
          }
          }

          &:last-child {
            // flex: 0 0 100%;
          }

          &.first {
            flex: 0 0 80%;
            // min-width: 70vw;
            padding: $gap ($gap * 2) $gap;
            height: calc($vh - ($base * 5));
            display: flex;
            gap: $base;
            flex-direction: column;
            transition: transform 666ms, opacity 666ms;

            @media (max-width: $mobile) {
              height: auto;
              padding: $mobile_gap;
              transform: translateY($base * 2);
            }

            :global(p) {
              max-width: 572px;

              @media (max-width: $mobile) {
                display: none;
              }
            }

            @media (max-height: $mobile) {
              :global(p) {
                max-width: 88%;
              }
            }

            button {
              position: absolute;
              bottom: ($base * 10);
              right: ($base * 10);
              transition: opacity 333ms;
              opacity: 1;

              @media (min-width: $mobile) {
                display: none;
              }

              @media (max-width: $tablet_portrait) {
                left: $mobile_gap;
                right: auto;
                bottom: ($mobile_base * 16);
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
                width: auto;
                background-color: transparent;
                padding: 0;

                @media (max-width: $tablet_portrait) {
                  height: 12vh;
                }
              }

              @media (max-width: $mobile) {
                padding: 0;
                width: auto;
                // transform: translateY($base * 1);
                // margin-bottom: calc($base * -5);
              }
            }

            @media (min-width: $tablet_portrait) {
              &.active + li :global(img) {
                transform: scale(1.75) translate(calc($base * -6), calc($base * 2));
              }
            }

            @media (max-width: $tablet_portrait) {
              &.active + li :global(img) {
                transform: translate(-50%, 0);
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
        // align-self: flex-start;

        @media (max-width: $mobile) {
          .button {
            flex: 1;
            gap: $mobile_base;
          }
        }

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