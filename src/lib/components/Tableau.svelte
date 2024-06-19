<script lang="ts">
  import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import Media from './Media.svelte'

  export let oeuvres: (Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> & { ligne?: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> })[]
  export let ligne: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let lignes: { [id: string]: boolean } = undefined
  export let thumbnails: boolean = false
</script>

<table class:lignes>
  <tr>
    <th><p>Événement</p></th>
    <th></th>
    <th><p>Artiste</p></th>
    <th><p>Oeuvre</p></th>
    <th></th>
  </tr>
  {#each oeuvres.filter(o => (lignes) ? lignes[o.ligne?.fields.id] : true) as oeuvre (oeuvre.fields.id)}
  <a href="/oeuvres/{oeuvre.fields.id}" style:--couleur={ligne?.fields.couleur || oeuvre.ligne?.fields.couleur || oeuvre.fields.couleur} on:click>
    <td>
      <h2>{oeuvre.fields.annee}</h2>
    </td>
    <td>
      <p>{oeuvre.fields.description || '-'}</p>
    </td>
    <td class="artist">
      <p>{oeuvre.fields.artiste?.fields.nom || '-'}</p>
    </td>
    <td>
      <p>
        {oeuvre.fields.titre}<br />
        {oeuvre.fields.anneeDeRealisation || oeuvre.fields.annee}<br />
        {oeuvre.fields.medium}<br />
        {oeuvre.fields.largeur} cm x {oeuvre.fields.hauteur} cm
        <!-- {oeuvre.fields.largeur}cm   -->
      </p>
    </td>
    <td class:thumbnails>
      {#if oeuvre.fields.vignette}
      <figure>
        <Media media={oeuvre.fields.vignette} small />
      </figure>
      {/if}
    </td>
  </a>
  {/each}
</table>

<style lang="scss">
  table {
    // margin: ($gap * 2) 0;

    tr {
      &:first-child {
        @media (max-width: $mobile) {
          display: none;
        }
      }
    }

    td,
    th {
      padding: ($base);
      padding-left: ($gap * 2);
      width: 30%;

      @media (min-width: $mobile) {
        &:first-child {
          padding-left: 0;
          width: 10%;
        }
      }

      @media (max-width: $mobile) {
        border: none;
        padding: 0 ($mobile_base) ($mobile_base) 0;
        width: 50%;
      }
    }

    td:nth-last-child(2) {
      @media (max-width: $mobile) {
        order: 99;
      }
    }

    td:last-child {

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

    a {
      display: table-row;
      line-height: 1.3;

      td {
        vertical-align: middle;
      }

      @media (max-width: $mobile) {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid;
        padding-top: $mobile_base;

        &:last-of-type {
          border-bottom: 1px solid;
        }

        .artist {
          display: none;
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
      &:focus {
        
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
      @media (max-width: $mobile) {
        h2 {
          display: block;
          padding: 0;
          background-color: transparent !important;
          line-height: 1;
        }
      }
    }
  }
</style>