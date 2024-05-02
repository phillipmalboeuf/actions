<script lang="ts">
  import Content from '$lib/components/Content.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Media from '$lib/components/Media.svelte'
  import { onMount } from 'svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>


<main>
  <Content content={data.page.fields.contenu} />

  <nav>
    <h6>Sélectionner une ligne du temps<br>pour débuter votre visite</h6>
    <h2 class="flex flex--spaced"><Icon i="tip" label="À partir de " /><span>1942</span> <Icon i="tip" label="Jusqu'à" /><span>2022</span></h2>
    <hr>
    <ul class="list--nostyle">
      {#each data.lignes as ligne}
      <li class="flex flex--spaced flex--middle flex--gapped">
        <a href="/lignes/{ligne.fields.id}" class=""><Media media={ligne.fields.logotype} /></a>
        <a href="/lignes/{ligne.fields.id}/video" class="col col--4of12"><Icon i="play" label="Visionner vidéo" /> <Media media={ligne.fields.vignette} small /></a>
        <a class="button" href="/lignes/{ligne.fields.id}" style:--color={ligne.fields.couleur}>Visiter</a>
        <hr>
      </li>
      {/each}
    </ul>
  </nav>
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

    nav {
      position: relative;
      z-index: 1;
      padding: ($gap * 4) ($gap * 2) ($gap * 8);
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
      }

      h2 {
        position: relative;
        margin-bottom: $gap;
        font-size: $base * $scale * 3;

        :global(svg) {
          position: absolute;
          left: $gap * -1.5;
          top: 100%;

          :global(path):last-child {
            fill: transparent;
          } 

          &:last-of-type {
            left: auto;
            right: $gap * -1.5;
            top: calc(100% - 1px);
            transform: rotate(180deg);
          }
        }

        + hr {
          margin: 0 ($gap * -1.5);
          width: calc(100% + ($gap * 3));
          max-width: calc(1560px + ($gap * 3));
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
            }
          }

          &:nth-child(2) {
            a:first-child {
              :global(img) {
                height: $base * 7.5;
              }
            }
          }

          a {
            position: relative;

            :global(svg) {
              position: absolute;
              top: $base;
              left: $base;
              color: var(--foreground-inverse);
            }
          }

          &:nth-child(2n) {
            a:last-of-type {
              order: -1;
            }
          }
        }
      }
    }
  }
</style>
