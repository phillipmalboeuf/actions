<script lang="ts">
  import type { Entry, EntryCollection } from 'contentful'
  import type { TypeArtisteSkeleton, TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import { goto, preloadData, pushState } from '$app/navigation'
  import { browser } from '$app/environment'
  import type { EventHandler } from 'svelte/elements'

  import Tableau from './Tableau.svelte'

  export let visible = false

  export let query: string = undefined
  export let artist: string = undefined
  export let annee: string = undefined
  export let medium: string = undefined
  export let results: EntryCollection<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined

  export let artists: EntryCollection<TypeArtisteSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let annees: number[] = undefined
  export let mediums: string[] = undefined
  export let lignes: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[] = undefined


  $: {
    if (browser && !artists && visible) {
      preloadData(`/search`).then(result => {
        if (result.type === 'loaded' && result.status === 200) {
          artists = result.data.artists
          annees = result.data.annees
          mediums = result.data.mediums
          lignes = result.data.lignes
        }
      })
    }
  }


  let waiting = false

  const submit: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
      // if (e.metaKey) return;

    waiting = true
      
    const path = `/search?query=${e.currentTarget['query'].value}&artist=${e.currentTarget['artist'].value}&annee=${e.currentTarget['annee'].value}&medium=${e.currentTarget['medium'].value}`
    const result = await preloadData(path)

    if (result.type === 'loaded' && result.status === 200) {
      query = result.data.query
      artist = result.data.artist
      annee = result.data.annee
      medium = result.data.medium
      results = result.data.results

      pushState(path, { search: result.data })

      waiting = false
    } else {
      goto(path)
    }
  }
</script>

<form class="flex flex--gapped" action="/search" method="get" on:submit|preventDefault={submit}>
  <label for="query">Inscrire les termes recherchés</label>
  <input type="search" name="query" id="query" placeholder="Recherche…" bind:value={query}>

  <fieldset class="col col--6of12">
    <div class="flex flex--tight_gapped">
      {#if artists}
      <select class="col col--4of12" name="artist" value={artist || ""}>
        <option value={""}>Artiste</option>
        {#each artists.items as artist}
        <option value={artist.fields.id}>{artist.fields.nom}</option>
        {/each}
      </select>
      {/if}

      {#if mediums}
      <select class="col col--4of12" name="medium" value={medium || ""}>
        <option value={""}>Type d'oeuvre</option>
        {#each mediums as medium}
        <option value={medium}>{medium}</option>
        {/each}
      </select>
      {/if}

      {#if annees}
      <select class="col col--4of12" name="annee" value={annee || ""}>
        <option value={""}>Année de production</option>
        {#each annees as annee}
        <option value={annee.toString()}>{annee}</option>
        {/each}
      </select>
      {/if}
    </div>
  </fieldset>

  <button class="button--inverse" type="submit">{#if waiting}Un instant...{:else}Rechercher{/if}</button>

  {#if results}
  {#if results.total === 0}
  <div class="col col--12of12"><em>Aucun résultats</em></div>
  {:else}
  <Tableau oeuvres={results.items} />
  {/if}
  {/if}
</form>

<style lang="scss">
  form {
    align-items: flex-start;
    padding: $gap;

    fieldset {
      margin-bottom: $gap * 2;
    }

    button {
      margin-left: auto;
    }
  }
</style>