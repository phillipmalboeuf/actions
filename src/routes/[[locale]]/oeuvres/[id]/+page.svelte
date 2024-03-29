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
    <Media media={data.oeuvre.fields.vignette} eager />

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
    <h5>{data.oeuvre.fields.description}</h5>
    <aside>
      {data.oeuvre.fields.artiste.fields.nom}<br />
      {data.oeuvre.fields.titre}<br />
      {data.oeuvre.fields.annee}<br />
      {data.oeuvre.fields.medium}
    </aside>

    {#if data.oeuvre.fields.corps}
    <Document body={data.oeuvre.fields.corps} />
    {/if}

    <h3>Détails techniques de l’œuvre</h3>
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
    padding: ($gap * 2) ($gap * 2);
    min-height: 100vh;
    // justify-content: space-around;

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

      h1 {
        font-size: $base * 8;
        width: 50%;
        text-align: center;
        margin-right: ($gap * 2);
      }
    }

    main {
      display: flex;
      flex-direction: column;
      gap: $gap;
      margin: auto;

      margin-top: ($gap * 10);

      aside {
        line-height: 1.333;
        margin-bottom: $gap * 2;
      }

      h3 {
        margin-top: $gap * 2;
      }

      table {

        h6 {
          margin-bottom: $base * 0.33;
        }
      }
    }

    figure {
      align-self: flex-start;
      position: sticky;
      top: 50%;
      transform: translateY(-50%);
      
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