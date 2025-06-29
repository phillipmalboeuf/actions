<script lang="ts">
  import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'

  import { onMount } from 'svelte'
  import { browser } from '$app/environment'

  import { intlNumber } from '$lib/formatters' 
  import Media from './Media.svelte'
  import { languageTag } from '$lib/paraglide/runtime'

  export let oeuvres: (Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> & { ligne?: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> })[]
  export let ligne: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let lignes: { [id: string]: boolean } = undefined
  export let thumbnails: boolean = false

  onMount(() => {
    if (browser && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      thumbnails = true
    }
  })
</script>

{#if oeuvres.filter(o => (lignes) ? lignes[o.ligne?.fields.id] : true).length > 0}
<table class:lignes>
  <tbody>
  <tr>
    <th><p>{languageTag() === "en" ? "Event" : "Événement"}</p></th>
    <th><p>{languageTag() === "en" ? "Artist" : "Artiste"}</p></th>
    <th><p>{languageTag() === "en" ? "Work" : "Œuvre"}</p></th>
    <th class:thumbnails aria-label={languageTag() === "en" ? "Thumbnail" : "Vignette"}></th>
  </tr>
  {#each oeuvres.filter(o => (lignes) ? lignes[o.ligne?.fields.id] : true) as oeuvre (oeuvre.fields.id)}
  <tr class="oeuvre" style:--couleur={ligne?.fields.couleur || oeuvre.ligne?.fields.couleur || oeuvre.fields.couleur}>
    <td class="description">
      <a class="flex flex--thick_gapped flex--middle" href="/oeuvres/{oeuvre.fields.id}" on:click>
        <h2>{oeuvre.fields.anneeEvenement}</h2>
        <p>{@html oeuvre.fields.description || '-'}{#if lignes}<br>({oeuvre.ligne?.fields.titre}){/if}</p>
      </a>
    </td>
    <td class="artist">
      <a href="/oeuvres/{oeuvre.fields.id}" on:click>
        {#if oeuvre.fields.artiste}
        <p>{@html (oeuvre.fields.artiste.fields.prenom ? `${oeuvre.fields.artiste.fields.nomFamille}, ${oeuvre.fields.artiste.fields.prenom}` : oeuvre.fields.artiste.fields.nom).replace('(', '<br>(')}</p>
        {/if}
      </a>
    </td>
    <td class="cartel">
      <a href="/oeuvres/{oeuvre.fields.id}" on:click>
        {#if oeuvre.fields.artiste}
        <div>{@html (oeuvre.fields.artiste.fields.prenom ? `${oeuvre.fields.artiste.fields.nomFamille}, ${oeuvre.fields.artiste.fields.prenom}` : oeuvre.fields.artiste.fields.nom).replace('(', '<br>(')}</div>
        {/if}
        <p>
          <em>{@html oeuvre.fields.titre}</em><br />
          {oeuvre.fields.anneeDeRealisation || oeuvre.fields.annee}<br />
          {oeuvre.fields.medium}
          {#if oeuvre.fields.largeur}
          <br />
          {#if oeuvre.fields.dimensions}{oeuvre.fields.dimensions}{:else}{intlNumber(oeuvre.fields.largeur)} x {intlNumber(oeuvre.fields.hauteur)} {#if oeuvre.fields.profondeur}x {intlNumber(oeuvre.fields.profondeur)} cm{:else}cm{/if}{/if}{/if}
        </p>
      </a>
    </td>
    <td class:thumbnails>
      <a href="/oeuvres/{oeuvre.fields.id}" on:click>
        {#if oeuvre.fields.vignette}
        <figure>
        <Media media={oeuvre.fields.vignette} small />
        </figure>
        {/if}
      </a>
    </td>
  </tr>
  {/each}
  </tbody>
</table>
{:else}
<div class="empty">
<em>{languageTag() === "en" ? "No results" : "Aucun résultat"}</em>
</div>
{/if}

<style lang="scss">
  table {
    // margin: ($gap * 2) 0;

    tr {
      &:first-child {
        th {
          border-bottom: 1px solid;

          &:last-child:not(.thumbnails) {
            border-bottom: none;
          }
        }

        @media (max-width: $mobile) {
          display: none;
        }
      }
    }

    td,
    th {
      // padding: ($base);
      // padding-left: ($gap * 2);
      width: 30%;

      @media (min-width: $mobile) {
        &:first-child {
          padding-left: 0;
          // width: 10%;
        }
      }

      @media (max-width: $mobile) {
        border: none;
        padding: 0 ($mobile_base) ($mobile_base) 0;
        width: 50%;

        &.cartel,
        &.description {
          padding-right: 0;
        }
      }
    }

    th {
      padding-top: 0;
      padding-bottom: ($base * 0.5);

      &:not(:first-child) {
        padding-left: ($gap * 2);
      }
    }

    td:nth-last-child(2) {
      @media (max-width: $mobile) {
        order: 99;
      }
    }

    td:last-child {

      @media (max-width: $mobile) {
        a {
          padding-left: 0 !important;
        }

        figure {
          padding-right: $base;
        }
      }

      @media (min-width: $mobile) {
        &.thumbnails {
          padding: ($base * 0.5) 0 ($base * 0.5) ($base * 1);

          figure {
            width: $gap * 5;
            margin-left: auto;
          }
        }

        figure {
          width: $gap * 10;
        }

        &:not(.thumbnails) {
          border: none;
          position: relative;
          // width: $gap * 14;
          padding: 0;

          figure {
            position: absolute;
            top: 0;
            right: 0;
            opacity: 0;
            transition: opacity 333ms;
          }
        }
      }
    }

    .oeuvre {
      // display: table-row;
      cursor: pointer;
      line-height: 1.3;

      td {
        vertical-align: middle;
        padding: 0;

        a {
          padding: ($base);
          padding-left: ($gap * 2);

          &:not(.flex) {
            display: block;
          }
        }

        &:first-child {
          a {
            padding-left: 0;
          }
        }
      }

      .description {
        p {
          flex: 1;
          width: auto;
        }

        @media (min-width: $tablet_landscape) {
          .flex {
            flex-wrap: nowrap;
          }
        }

        @media (max-width: $tablet_landscape) {
          .flex {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: $mobile) {
          .flex {
            flex-direction: row;
            // align-items: flex-start;
          }
        }
      }

      @media (max-width: $mobile) {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid;
        padding-top: $mobile_base;

        &:last-of-type {
          border-bottom: 1px solid;
        }

        .description {
          width: 100%;

          p {
            flex: none;
            margin-left: auto;
            width: calc(50% - ($mobile_base * 0.5));
          }
        }

        .artist {
          display: none;
        }

        .cartel a {
          padding-left: 0;
        }
      }

      @media (min-width: $mobile) {
        .cartel {
          div {
            display: none;
          }
        }
      }

      h2 {
        display: inline-block;
        font-size: $base * $scale * 1.5;
        padding: ($base * 0.05) ($base * 1);
        border-radius: 1em;
        // background-color: var(--couleur);
        transition: background-color 333ms;
      }

      &:hover,
      &:focus-visible,
      &:first-of-type:not(:has(~ a:hover)):not(:has(~ a:focus-visible)) {
        
        h2 {
          background-color: var(--couleur);
        }

        figure {
          opacity: 1 !important;
        }
      }
    }

    &.lignes {
      h2 {
        background-color: var(--couleur);
      }
    }

    &:not(.lignes) {
      @media (max-width: $tablet_landscape) {
        h2 {
          display: block;
          padding: 0;
          background-color: transparent !important;
          line-height: 1;
        }
      }
    }
  }

  .empty {
    width: 100%;
  }
</style>