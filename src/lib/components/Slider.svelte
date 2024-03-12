<script lang="ts">
  import { type EmblaOptionsType, type EmblaCarouselType } from 'embla-carousel'
  import emblaCarouselSvelte, { type EmblaCarouselSvelteType } from 'embla-carousel-svelte'
  import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay'
  import Autoheight from 'embla-carousel-auto-height'
  import { onDestroy, onMount } from 'svelte'

  export let loop = true
  export let disabled = false
  export let buttons = true
  export let autoplay = true
  export let autoheight = true
  export let dots: number = undefined

  let options: EmblaOptionsType = { loop }
  let plugins = [
    ...autoplay ? [Autoplay({ stopOnFocusIn: true })] : [],
    ...autoheight ? [Autoheight()] : [],
  ]

  let slider: EmblaCarouselType
  let active = 0

  onDestroy(() => {
    slider?.destroy()
  })
</script>

{#if !disabled}
<figure class="slider" on:emblaInit={(event) => {
  // @ts-ignore
  slider = event.detail
  slider.on("select", () => active = slider.selectedScrollSnap())
}} use:emblaCarouselSvelte={{ options, plugins }}>
  <slot />
</figure>

{#if buttons}
<nav>
  <button class="previous" on:click={() => slider.scrollPrev()}><svg width="19" height="19" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 8.0074H3.7581L10.2398 1.41229L8.85183 0L0 9.00666L8.85183 18L10.2398 16.5877L3.7581 10.0059H19V8.0074Z"/></svg>
</button>
  <button class="next" on:click={() => slider.scrollNext()}><svg width="19" height="19" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.00029e-07 9.9926L15.2419 9.9926L8.76017 16.5877L10.1482 18L19 8.99334L10.1482 -7.73851e-07L8.76017 1.41229L15.2419 7.99408L8.74746e-07 7.99408L7.00029e-07 9.9926Z"/> </svg> </button>
</nav>
{/if}

{#if dots}
<nav class="dots">
  {#each Array(dots) as d, i}
  <button class="dot" class:active={active === i} on:click={() => {
    slider.scrollTo(i)
    // @ts-ignore
    slider.plugins().autoplay.reset()
  }}>{i}</button>
  {/each}
</nav>
{/if}
{:else}
<slot />
{/if}

<style lang="scss">
.slider {
  // overflow: hidden;
  // cursor: ew-resize;
  position: relative;

  :global(.slider__container) {
    list-style: none;
    display: flex;
    align-items: flex-start;
    transition: height 333ms;
  }
    
    :global(.slide) {
      flex: 0 0 100%;
      min-width: 0;
    }
} 

nav {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: $base;
  right: $base;
  transform: translateY(-50%);
  pointer-events: none;

  display: flex;
  justify-content: space-between;

  button {
    pointer-events: auto;
    // width: 0;
    display: inline-flex;
    justify-content: center;
    border-radius: 50%;
    padding: $base * 0.5;
  }

  &.dots {
    top: auto;
    left: auto;
    bottom: calc(100% + ($base * 0.5));
    right: $base * 0.5;
    transform: none;

    gap: $base * 0.333;

    button.dot {
      font-size: 0;
      padding: $base * 0.25;

      &.active {
        background-color: $grey;
      }
    }
  }
}
</style>