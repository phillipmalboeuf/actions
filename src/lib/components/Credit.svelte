<script lang="ts">
  import type { TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'

  export let oeuvre: Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let full = false
</script>

<div>{#if oeuvre.fields.artiste.fields.prenom}{oeuvre.fields.artiste.fields.prenom} {oeuvre.fields.artiste.fields.nomFamille}{:else}{oeuvre.fields.artiste.fields.nom}{/if}</div>
<div><em>{@html oeuvre.fields.titre}</em></div>
{#if full}
<div>{oeuvre.fields.anneeDeRealisation || oeuvre.fields.annee}</div>
<div>{oeuvre.fields.medium}</div>
{/if}