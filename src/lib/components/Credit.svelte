<script lang="ts">
  import type { TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'

  export let oeuvre: Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<div>{oeuvre.fields.artiste.fields.nom}</div>
<div><em>{oeuvre.fields.titre}</em></div>
<div>{oeuvre.fields.anneeDeRealisation || oeuvre.fields.annee}</div>
<div>{oeuvre.fields.medium}</div>