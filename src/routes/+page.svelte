<script lang="ts">
  import Content from '$lib/components/Content.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import { openDialog } from '$lib/helpers'

  import type { PageData } from './$types'
  export let data: PageData
</script>


<div class="random-{data.random}">
  <Content content={data.page.fields.contenu} format={data.page.fields.format} />

  <nav id="lignes">
    <h6 role="none">Sélectionner une ligne du temps<br>pour débuter votre visite</h6>
    <h2 class="flex flex--spaced" role="none"><Icon i="tip" label="Jusqu'à 2022" /></h2>
    <hr>
    <ul class="list--nostyle">
      {#each data.lignes as ligne}
      <li class="flex flex--spaced flex--middle flex--gapped">
        <a href="/lignes/{ligne.fields.id}" class="col col--4of12"><Media media={ligne.fields.logotype} /></a>
        <a href="/lignes/{ligne.fields.id}/video" on:click={openDialog} class="video col col--4of12 col--mobile--12of12">
          <Icon i="play" label="Visionner vidéo" />
          <Media media={ligne.fields.vignette} small />
          {#if ligne.fields.vignetteVideo}
          <Media media={ligne.fields.vignetteVideo} eager small />
          {/if}
        </a>
        <div class="col col--4of12">
          <a class="button" href="/lignes/{ligne.fields.id}" style:--color={ligne.fields.couleur} aria-label="Visiter {ligne.fields.titre}">Visiter</a>
        </div>
        <hr>
      </li>
      {/each}
    </ul>
  </nav>

  {#if data.page.fields.credits}
  <small>
    <Document body={data.page.fields.credits} />
  </small>
  {/if}
</div>

<style lang="scss">
  div {
    // --background: #{$yellow};
    // background-color: var(--background);
    // min-height: 200vh;

    :global(.text),
    :global(.gallerie) {
      position: relative;
      z-index: 1;
      padding: $gap;

      &:first-of-type {
        // margin-top: $vh;
      }

      @media (max-width: $mobile) {
        padding: $mobile_gap;
      }
    }

    :global(.gallerie) {
      padding-top: 0;
      padding-bottom: 0;
    }

    :global(.text) {
      > :global(table) {
        width: 100%;
        max-width: 1560px;
        margin: 0 auto;

        :global(td) {
          @media (min-width: $tablet_portrait) {
            padding: 0 $mobile_gap !important;
          }

          :global(strong) {
            font-size: $base + 2px;
            font-weight: normal !important;
          }
        }

        :global(td:first-child) {
          // padding-left: 0 !important;
          font-size: $base + 2px;
        }
        
        :global(td:last-child > *) {
          max-width: 644px;
          margin: 0 auto;
        }
      }
    }

    nav,
    small {
      position: relative;
      z-index: 1;
      padding: ($gap * 4) ($gap * 2) ($gap * 2);
      background-color: var(--background);

      @media (max-width: $mobile) {
        padding: ($mobile_gap * 0) ($mobile_gap * 1) ($mobile_gap * 2);
      }

      display: flex;
      flex-direction: column;
      // align-items: center;
      gap: $base * 0.5;

      > * {
        max-width: 1560px;
        margin: 0 auto;
      }

      hr {
        width: 100%;
        height: 1.5px;
      }

      h6 {
        margin-bottom: $gap * -1;
        // margin-left: 0;
        width: 1560px;
        max-width: 100%;
        font-size: $base * $scale;
        font-weight: normal;
        // text-align: center;

        @media (max-width: $mobile) {
          font-size: $base;
        }
      }

      h2 {
        position: relative;
        margin-bottom: $gap;
        font-size: $base * $scale * 3;

        @media (max-width: $mobile) {
          font-size: $mobile_gap * 2;
          margin-bottom: $gap;
        }

        :global(svg) {
          position: absolute;
          left: $gap * -1.5;
          top: calc(100% - 1px);

          :global(path):last-child {
            fill: transparent;
          } 

          &:last-of-type {
            left: auto;
            right: 0;
            top: calc(100% - 1px);
            transform: rotate(180deg);
          }

          @media (max-width: $mobile) {
            top: calc(100% - 1px);
            left: $mobile_gap * -0.5;

            &:last-of-type {
              left: auto;
              right: 0;
            }
          }
        }

        + hr {
          // margin: 0 auto 0 auto;
          // width: calc(100% + ($gap * 1.5));
          // max-width: calc(1560px + ($gap * 3));

          // @media (max-width: $mobile) {
          //   margin: 0 0 $mobile_gap;
          //   width: calc(100% + ($mobile_gap * 0.5));
          // }
        }
      }

      ul {
        width: 100%;

        li {
          padding-top: $gap;
          width: 100%;

          a:first-child {
            :global(img) {
              background-color: transparent;
              width: auto;
              height: $base * 6;
              object-fit: contain;
              object-position: left;

              @media (max-width: $tablet_landscape) {
                height: $base * 4;
              }

              @media (max-width: $tablet_portrait) {
                height: $mobile_base * 3.5;
              }
            }
          }

          @media (max-width: $mobile) {
            a:nth-child(2) {
              order: 99;
              margin: ($mobile_base * 0.75) 0 ($mobile_base * 0.5);
            }

            hr {
              order: 99;
            }
          }

          a.video {
            position: relative;

            :global(svg) {
              position: absolute;
              z-index: 2;
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
              top: 0;
              left: 0;
              opacity: 0;
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

          div {
            text-align: right;
          }

          &:nth-child(2n) {
            @media (min-width: $mobile) {
              div:nth-last-child(2) {
                order: -1;
                text-align: left;
              }
            }
          }
        }
      }
    }

    small {
      padding-top: 0;
      padding-bottom: ($gap * 4);
      max-width: calc(1560px + ($gap * 4));
      margin: 0 auto;
      
      :global(td),
      :global(th) {
        border: none;
      }

      
    }
  }
</style>
