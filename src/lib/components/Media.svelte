<script lang="ts">
  import type { Asset } from 'contentful'
  import { onDestroy, onMount } from 'svelte'

  export let media: Asset<"WITHOUT_UNRESOLVABLE_LINKS">
  export let small = false
  export let ar: number = undefined
  export let eager = false
  export let title = false
  export let video: HTMLVideoElement = undefined
  export let img: HTMLElement = undefined

  function cdn(url: string) {
    return url.replace('//downloads.ctfassets.net', '//images.ctfassets.net')
  }

  function reset() {
    img = img
  }

  onMount(() => {
    img && img.addEventListener("load", reset)
  })

  onDestroy(() => {
    img && img.removeEventListener("load", reset)
  })
</script>

<style lang="scss">
  img,
  video,
  audio {
    display: block;
    width: 100%;
    object-fit: cover;
    // background-color: var(--background-inverse);
  }

  video {
    cursor: pointer;
  }
 
  audio::-webkit-media-controls-enclosure {
  }
</style>

{#if media}
{#if typeof media !== 'string'}
{#if media.fields.file.contentType.startsWith('video/')}
<!-- svelte-ignore a11y-media-has-caption -->
<video src="{cdn(media.fields.file.url)}" controls={eager ? false : true} bind:this={video} autoplay={eager} muted={eager} loop={eager} playsinline={eager ? true : false} />
{:else if media.fields.file.contentType.startsWith('audio/')}
<!-- {#if !noDescription && media}
<small>{media}</small>
{/if} -->
<!-- svelte-ignore a11y-media-has-caption -->
<audio src="{cdn(media.fields.file.url)}" controls />
{:else}
{@const attribute = media.fields.file.details.image.width > media.fields.file.details.image.height ? 'w' : ar ? 'w' : 'h'}
<!-- {JSON.stringify(media, null, 2)} -->
<picture>
  {#if small}
  <source srcSet="{cdn(media.fields.file.url)}?{attribute}=400{ar ? `&fit=crop&h=${Math.round(400 * ar)}` : ''}" media="(max-width: 900px)" />
  <source srcSet="{cdn(media.fields.file.url)}?{attribute}=600{ar ? `&fit=crop&h=${Math.round(600 * ar)}` : ''}" media="(max-width: 1200px)" />
  <img src="{cdn(media.fields.file.url)}?{attribute}=800{ar ? `&fit=crop&h=${Math.round(800 * ar)}` : ''}"
    style={`aspect-ratio: ${ar ? `800 / ${Math.round(ar * 800) + 2}` : `${media.fields.file.details.image.width} / ${media.fields.file.details.image.height}`}`}
    alt="{(!title && media.fields.description) ? media.fields.description : media.fields.title}"
    title="{(!title && media.fields.description) ? media.fields.description : media.fields.title}"
    loading={eager ? "eager" : "lazy"} />
  {:else}
  <source srcSet="{cdn(media.fields.file.url)}?{attribute}=900{ar ? `&fit=crop&h=${Math.round(900 * ar)}` : ''}" media="(max-width: 900px)" />
  <source srcSet="{cdn(media.fields.file.url)}?{attribute}=1200{ar ? `&fit=crop&h=${Math.round(1200 * ar)}` : ''}" media="(max-width: 1200px)" />
  <img bind:this={img} src="{cdn(media.fields.file.url)}?{attribute}=1400{ar ? `&fit=crop&h=${Math.round(1400 * ar)}` : ''}"
    style={`aspect-ratio: ${ar ? `1400 / ${Math.round(ar * 1400) + 2}` : `${media.fields.file.details.image.width} / ${media.fields.file.details.image.height}`}`}
    alt="{(!title && media.fields.description) ? media.fields.description : media.fields.title}"
    title="{(!title && media.fields.description) ? media.fields.description : media.fields.title}"
    loading={eager ? "eager" : "lazy"} />
  {/if}
</picture>
{/if}
{:else}
<picture>
  <img bind:this={img} src="{cdn(media)}?w=100{ar ? `&fit=crop&h=${Math.round(100 * ar)}` : ''}"
    style={ar ? `aspect-ratio: 100 / ${Math.round(ar * 100)}` : ''}
    alt="" loading={eager ? "eager" : "lazy"} />
</picture>
{/if}
{/if}