<script lang="ts">
  import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'
  import ZoomPage from './zoom/+page.svelte'

  import { year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'
  import { pushState } from '$app/navigation'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  export let data: PageData

  export let retour = false
</script>

<section style="background-color: {data.oeuvre.fields.couleur};" class="flex flex--gapped">
  <header>
    {#if !retour}
    <a href="/">Retour</a>
    {:else}
    <span></span>
    {/if}
    <h1>{data.oeuvre.fields.annee}</h1>
  </header>

  <figure class="col col--6of12">
    <Media media={data.oeuvre.fields.vignette} />

    <figcaption>
      <small>
        Musée d’art de Joliette<br />
        © Anne Kahane
      </small>
      <a href="/oeuvres/{data.oeuvre.fields.id}/zoom" on:click={openDialog}><Icon i="view" label="Zoom" /></a>
      <a href="https://{data.oeuvre.fields.vignette.fields.file.url}" download="{data.oeuvre.fields.annee}-{data.oeuvre.fields.titre.replaceAll(' ', '-')}.png" target="_blank" rel="external"><Icon i="download" label="Téléchargement" /></a>
    </figcaption>
  </figure>
  <main class="col col--5of12">
    <h2>{data.oeuvre.fields.description}</h2>
    <aside>
      {data.oeuvre.fields.artiste.fields.nom}<br />
      {data.oeuvre.fields.titre}<br />
      {data.oeuvre.fields.annee}<br />
      {data.oeuvre.fields.medium}
    </aside>

    {#if data.oeuvre.fields.corps}
    <Document body={data.oeuvre.fields.corps} />
    {/if}

    <h2>Détails techniques de l’œuvre</h2>
    <table>
      <tr>
        <td colspan="2">
          <h6>Nom de l’artiste</h6>
          {data.oeuvre.fields.artiste.fields.nom}<br>
          <small>{data.oeuvre.fields.artiste.fields.description}</small>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h6>Titre de l’œuvre</h6>
          {data.oeuvre.fields.titre}
        </td>
      </tr>
      <tr>
        <td>
          <h6>Année de réalisation</h6>
          {data.oeuvre.fields.annee}
        </td>
        <td>
          <h6>Médium</h6>
          {data.oeuvre.fields.medium}
        </td>
      </tr>
      <tr>
        <td>
          <h6>Dimensions</h6>
          {data.oeuvre.fields.dimensions}
        </td>
        <td>
          <h6>Numéro d’accession</h6>
          {data.oeuvre.fields.numero}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h6>Mention du donateur</h6>
          {data.oeuvre.fields.mention}
        </td>
      </tr>
    </table>
  </main>
</section>


<style lang="scss">
  section {
    padding: 10vw;
    min-height: 100vh;
    justify-content: space-around;

    @media (max-width: $mobile) {
      padding: $mobile_base;
    }

    header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      display: flex;
      justify-content: space-between;

      > a {
        padding: $base;
      }
    }

    main {
      display: flex;
      flex-direction: column;
      gap: $base;
    }

    figure {
      
      :global(img),
      :global(video) {
        max-height: 66vh;
        object-fit: contain;
        background-color: transparent;
      }

      figcaption {
        display: flex;
        gap: $base;
        margin-top: $base;

        a:first-of-type {
          margin-left: auto;
        }
      }
    }
  }

</style>