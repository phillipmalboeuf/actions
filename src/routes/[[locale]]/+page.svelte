<script lang="ts">
  import Content from '$lib/components/Content.svelte'
  import Logo from '$lib/components/Logo.svelte'

  import type { PageData } from './$types'
  export let data: PageData

  let scrollY = 0
  let innerHeight: number
</script>

<svelte:window bind:scrollY bind:innerHeight />

<main>
  <figure style="--scroll: {!innerHeight ? 0 : scrollY > innerHeight ? 1 : scrollY / innerHeight}">
    <figcaption>Actions collectives. Regards féministes sur la collection.</figcaption>
    <Logo />
  </figure>

  <Content content={data.page.fields.contenu} />
</main>

<style lang="scss">
  main {
    --background: #{$yellow};
    background-color: var(--background);
    min-height: 200vh;

    figure {
      position: fixed;
      top: 0;
      left: 0;
      padding: $gap;

      figcaption {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }

      :global(svg) {
        // padding: $gap;
        width: auto;
        height: calc(100vh - ($gap * 2));
        overflow: visible;
        object-position: left top;
        background-color: var(--background);

        :global(g) {
          will-change: transform;

          &:nth-child(2) {
            transform: translateX(calc((1 - var(--scroll)) * 10vw / 6));
          }

          &:nth-child(4) {
            transform: translateX(calc((1 - var(--scroll)) * 30vw / 6));
          }

          &:nth-child(6) {
            transform: translateX(calc((1 - var(--scroll)) * 5vw / 6));
          }
        }
      }
    }

    :global(.text),
    :global(.gallerie) {
      position: relative;
      z-index: 1;
      padding: $gap;

      &:first-of-type {
        margin-top: 100vh;
      }
    }
  }
</style>
