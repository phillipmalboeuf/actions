<script lang="ts">
  import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import Media from './Media.svelte';
  import { year } from '$lib/formatters';

  export let oeuvres: Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
  export let ligne: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
</script>

<table>
  <tr>
    <th>Événement</th>
    <th></th>
    <th>Artiste</th>
    <th>Oeuvre</th>
    <th></th>
  </tr>
  {#each oeuvres as oeuvre}
  <a href="/oeuvres/{oeuvre.fields.id}" style:--couleur={ligne?.fields.couleur || oeuvre.fields.couleur}>
    <td>
      <h2>{oeuvre.fields.annee}</h2>
    </td>
    <td>
      {oeuvre.fields.description}
    </td>
    <td>
      {oeuvre.fields.artiste.fields.nom}
    </td>
    <td>
      {oeuvre.fields.titre}<br />
      {oeuvre.fields.medium}<br />
      {oeuvre.fields.dimensions}
    </td>
    <td>
      <figure>
        <Media media={oeuvre.fields.vignette} small />
      </figure>
    </td>
  </a>
  {/each}
</table>

<style lang="scss">
  table {
    // margin: ($gap * 2) 0;

    a {
      display: table-row;
      vertical-align: middle;

      h2 {
        display: inline-block;
        padding: ($base * 0.25) ($base * 0.75);
        border-radius: 1em;
        // background-color: var(--couleur);
        transition: background-color 333ms;
      }

      &:hover,
      &:focus {
        
        h2 {
          background-color: var(--couleur);
        }
      }

      figure {
        width: $gap * 5;
      }
    }
  }
</style>