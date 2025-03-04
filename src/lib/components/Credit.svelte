<script lang="ts">
  import type { TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import { intlNumber } from '$lib/formatters'

  export let oeuvre: Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let full = false
</script>

{#if oeuvre.fields.artiste}
<div>{#if oeuvre.fields.artiste.fields.prenom}{oeuvre.fields.artiste.fields.prenom} {oeuvre.fields.artiste.fields.nomFamille}{:else}{oeuvre.fields.artiste.fields.nom}{/if}</div>
{/if}
<div><em>{@html oeuvre.fields.titre}</em></div>
{#if full}
<div>{oeuvre.fields.anneeDeRealisation || oeuvre.fields.annee}</div>
<div>{oeuvre.fields.medium}</div>
<div>{intlNumber(oeuvre.fields.largeur)} cm x {intlNumber(oeuvre.fields.hauteur)} cm {#if oeuvre.fields.profondeur}x {intlNumber(oeuvre.fields.profondeur)} cm{/if}</div>
{/if}