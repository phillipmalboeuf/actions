<script lang="ts">
  import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  import Slider from '$lib/components/Slider.svelte';
  export let data: PageData

  export let retour = false
</script>

<section class="flex flex--gapped">
  <header>
    {#if !retour}
    <a href="/">Retour</a>
    {:else}
    <span></span>
    {/if}
    <h1>{data.ligne.fields.titre}</h1>
  </header>

  <Slider>
    <ol class="slider__container">
    {#each data.ligne.fields.oeuvres as oeuvre}
      <li class="slide">
        <figure>
          <Media media={oeuvre.fields.vignette} />
          <figcaption>{oeuvre.fields.titre}</figcaption>
          <figcaption><h2>{oeuvre.fields.annee}</h2></figcaption>
        </figure>
      </li>
    {/each}
    </ol>
  </Slider>
</section>


<style lang="scss">
  section {
    padding: 10vw;
    min-height: 100vh;
    justify-content: space-around;

    ol {
      list-style: none;
    }
  }
</style>