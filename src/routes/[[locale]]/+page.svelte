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


<main>
  <Content content={data.page.fields.contenu} format={data.page.fields.format} />

  <nav id="lignes">
    <h6>Sélectionner une ligne du temps<br>pour débuter votre visite</h6>
    <h2 class="flex flex--spaced"><Icon i="tip" label="À partir de " /><span>1942</span> <Icon i="tip" label="Jusqu'à" /><span>2022</span></h2>
    <hr>
    <ul class="list--nostyle">
      {#each data.lignes as ligne}
      <li class="flex flex--spaced flex--middle flex--gapped">
        <a href="/lignes/{ligne.fields.id}" class=""><Media media={ligne.fields.logotype} /></a>
        <a href="/lignes/{ligne.fields.id}/video" on:click={openDialog} class="col col--4of12 col--mobile--12of12"><Icon i="play" label="Visionner vidéo" /> <Media media={ligne.fields.vignette} small /></a>
        <a class="button" href="/lignes/{ligne.fields.id}" style:--color={ligne.fields.couleur}>Visiter</a>
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
</main>

<style lang="scss">
  main {
    // --background: #{$yellow};
    // background-color: var(--background);
    // min-height: 200vh;

    :global(.text),
    :global(.gallerie) {
      position: relative;
      z-index: 1;
      padding: $gap;

      &:first-of-type {
        // margin-top: 100vh;
      }
    }

    nav,
    small {
      position: relative;
      z-index: 1;
      padding: ($gap * 4) ($gap * 2) ($gap * 2);
      background-color: var(--background);

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $base * 0.5;

      > * {
        max-width: 1560px;
      }

      hr {
        width: 100%;
        height: 1.5px;
      }

      h6 {
        margin-bottom: $gap * -1;
        text-align: center;

        @media (max-width: $mobile) {
          margin-bottom: $mobile_gap * 2;
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
            right: $gap * -1.5;
            top: calc(100% - 1px);
            transform: rotate(180deg);
          }

          @media (max-width: $mobile) {
            top: calc(100% - 1px);
          }
        }

        + hr {
          margin: 0 ($gap * -1.5);
          width: calc(100% + ($gap * 3));
          max-width: calc(1560px + ($gap * 3));

          @media (max-width: $mobile) {
            margin-bottom: $mobile_gap;
          }
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
              height: $base * 6.66;
              object-fit: contain;
              object-position: left;

              @media (max-width: $mobile) {
                height: $mobile_base * 3.33;
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

          &:nth-child(2) {
            a:first-child {
              :global(img) {
                height: $base * 7.5;

                @media (max-width: $mobile) {
                  height: $mobile_base * 4.1;
                }
              }
            }
          }

          a {
            position: relative;

            :global(svg) {
              position: absolute;
              top: $base;
              left: $base;
              color: $beige;
              opacity: 0.88;

              @media (max-width: $mobile) {
                top: $mobile_base * 0.75;
                left: $mobile_base * 0.75;
              }
            }
          }

          &:nth-child(2n) {
            @media (min-width: $mobile) {
              a:last-of-type {
                order: -1;
              }
            }
          }
        }
      }
    }

    small {
      padding-top: 0;
      padding-bottom: ($gap * 4);
      
      :global(td),
      :global(th) {
        border: none;
      }
    }
  }
</style>
