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
  import Tableau from '$lib/components/Tableau.svelte';
  import Lignes from '$lib/components/Lignes.svelte';
  export let data: PageData

  export let retour = false
</script>

<section class="flex flex--thick_gapped">
  <header class="col col--12of12">
    {#if !retour}
    <a href="/">Accueil</a>
    {:else}
    <span></span>
    {/if}
    <h1>{data.ligne.fields.titre}</h1>
  </header>

  <nav class="col col--6of12">
    <Lignes current={data.lignes.findIndex(ligne => ligne.fields.id === data.ligne.fields.id)} lignes={data.lignes} />
  </nav>
  <nav class="col col--6of12">

  </nav>

  <main class="col col--12of12">
    <Tableau ligne={data.ligne} oeuvres={data.ligne.fields.oeuvres} />
  </main>

  <!-- <Slider>
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
  </Slider> -->
</section>


<style lang="scss">
  section {
    padding: $gap;
    // justify-content: space-around;

    // ol {
    //   list-style: none;
    // }

    nav {
      // margin: ($gap * 2) 0;
    }
  }
</style>