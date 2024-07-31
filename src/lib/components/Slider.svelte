<script lang="ts">
  import { type EmblaOptionsType, type EmblaCarouselType } from 'embla-carousel'
  import emblaCarouselSvelte, { type EmblaCarouselSvelteType } from 'embla-carousel-svelte'
  import Autoplay, { type AutoplayOptionsType } from 'embla-carousel-autoplay'
  import Autoheight from 'embla-carousel-auto-height'
  import { onDestroy, onMount, tick } from 'svelte'

  export let loop = true
  export let startIndex = 0
  export let wheel = false
  export let disabled = false
  export let buttons = true
  export let autoplay = true
  export let autoheight = true
  export let dots: number = undefined
  export let slidesPerView: number | "auto" = 1

  let options: EmblaOptionsType = { loop, startIndex }
  let plugins = [
    ...autoplay ? [Autoplay({ stopOnFocusIn: true })] : [],
    ...autoheight ? [Autoheight()] : [],
  ]

  export let slider: EmblaCarouselType = undefined
  export let active = 0
  export let location = 0
  export let scroll = 0
  export let last = 0

  let scrolling = false
  let timeout: NodeJS.Timeout

  onDestroy(() => {
    slider?.destroy()
  })
</script>

{#if !disabled}
<figure class="slider" style:--view={slidesPerView === "auto" ? "auto" : `${100 / slidesPerView}%`} on:emblaInit={(event) => {
  // @ts-ignore
  slider = event.detail
  const list = slider.scrollSnapList()
  const limit = slider.internalEngine().limit.length
  last = (1 - list[list.length - 2]) * limit

  slider.on("select", () => {
    active = slider.selectedScrollSnap()
  })
  slider.on("scroll", () => {
    location = slider.internalEngine().location.get()
    scroll = location + limit
  })
}} use:emblaCarouselSvelte={{ options, plugins }}
  on:wheel={e => {
    if (!wheel) return

    if (scrolling) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (e.deltaY > 0) {
      if (active < slider.scrollSnapList().length - 1) {
        e.preventDefault()
        e.stopPropagation()
        
        if (e.deltaY > 5 && !scrolling) {
          scrolling = true
          slider.scrollNext()

          timeout = setTimeout(() => {
            scrolling = false
          }, 666)
        }
      }
    } else if (active > 0) {
      if (window.scrollY <= 0) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (e.deltaY < -5 && !scrolling) {
        scrolling = true
        slider.scrollPrev()

        timeout = setTimeout(() => {
          scrolling = false
        }, 666)
      }
    }
  }}>
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
  overflow: hidden;
  // cursor: ew-resize;
  position: relative;

  :global(.slider__container) {
    list-style: none;
    display: flex;
    // align-items: flex-start;
    transition: height 333ms;
  }
    
    :global(.slide) {
      flex: 0 0 var(--view);
      min-width: 0;
      max-width: 100%;
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
    border-width: 1px;
  }

  &.dots {
    // top: auto;
    left: 50%;
    top: calc(100%);
    right: auto;
    transform: translate(-50%, -200%);

    gap: $base * 0.333;

    button.dot {
      font-size: 0;
      padding: $base * 0.33;

      &.active {
        background-color: $brown;
      }
    }

    @media (max-width: $tablet_portrait) {
      transform: translate(-50%, ($mobile_base * -6.66));

      button.dot {
        color: $white;

        &.active {
          background-color: $white;
        }
      }
    }
  }
}
</style>