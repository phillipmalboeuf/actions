<script lang="ts">
  import { page } from '$app/stores'
  
  import type { Entry, EntryCollection } from 'contentful'
  import type { TypeArtisteSkeleton, TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import { goto, preloadData, pushState } from '$app/navigation'
  import { browser } from '$app/environment'
  import type { EventHandler } from 'svelte/elements'

  import Tableau from './Tableau.svelte'
  import Icon from './Icon.svelte'

  export let visible = false

  export let query: string = undefined
  export let artist: string = undefined
  export let annee: string = undefined
  export let medium: string = undefined
  export let lignes: { [id: string]: boolean } = $page.data.lignes.reduce((ls, ligne) => ({
    ...ls,
    [ligne.fields.id]: true
  }), {})
  export let results: (Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> & { ligne: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> })[] = undefined

  export let artists: EntryCollection<TypeArtisteSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let annees: number[] = undefined
  export let mediums: string[] = undefined

  $: {
    if (browser && !artists && visible) {
      preloadData(`/search`).then(result => {
        if (result.type === 'loaded' && result.status === 200) {
          artists = result.data.artists
          annees = result.data.annees
          mediums = result.data.mediums
          // lignes = result.data.lignes
          results = result.data.results
        }
      })
    }
  }

  let form: HTMLFormElement
  let waiting = false

  const submit: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
      // if (e.metaKey) return;

    waiting = true
      
    const path = `/search?query=${e.currentTarget['query'].value}&artist=${e.currentTarget['artist'].value}&annee=${e.currentTarget['annee'].value}&medium=${e.currentTarget['medium'].value}&lignes=${Object.entries(lignes).filter((([id, value]) => !!value)).map(([id, value]) => id)}`
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

<form class="flex flex--gapped" bind:this={form} action="/search" method="get" on:submit|preventDefault={submit}>
  <label for="query">Inscrire les termes recherchés</label>
  <input type="search" name="query" id="query" placeholder="Recherche…" bind:value={query}>

  <aside class="col">
    <label for="artist">Filtres</label>
  </aside>

  <aside class="col">
    <a href="/search">Réinitialisé</a>
  </aside>

  <hr class="col col--12of12">

  <fieldset class="col col--7of12">
    <div class="flex flex--gapped">
      {#if artists}
      <fieldset class="col col--4of12">
        <select id="artist" name="artist" value={artist || ""} on:input={(e) => { form.requestSubmit() }}>
          <option value={""}>Artiste</option>
          {#each artists.items as artist}
          <option value={artist.fields.id}>{artist.fields.nom}</option>
          {/each}
        </select>
        <Icon i="down" label="Select" />
      </fieldset>
      {/if}

      {#if mediums}
      <fieldset class="col col--4of12">
        <select name="medium" value={medium || ""} on:input={(e) => { form.requestSubmit() }}>
          <option value={""}>Type d'oeuvre</option>
          {#each mediums as medium}
          <option value={medium}>{medium}</option>
          {/each}
        </select>
        <Icon i="down" label="Select" />
      </fieldset>
      {/if}

      {#if annees}
      <fieldset class="col col--4of12">
        <select name="annee" value={annee || ""} on:input={(e) => { form.requestSubmit() }}>
          <option value={""}>Année de production</option>
          {#each annees.filter(a => a) as annee}
          <option value={annee.toString()}>{annee}</option>
          {/each}
        </select>
        <Icon i="down" label="Select" />
      </fieldset>
      {/if}

      {#each $page.data.lignes as ligne}
      <fieldset class="col col--4of12" style:--couleur={ligne.fields.couleur}>
        <label class="ligne">
          {ligne.fields.titre}
          <input type="checkbox" name="{ligne.fields.id}" checked on:input={(e) => {
            lignes[ligne.fields.id] = e.currentTarget.checked
            form.requestSubmit()
          }}>
        </label>
      </fieldset>
      {/each}
    </div>
  </fieldset>

  <button class="button--inverse" type="submit">{#if waiting}Un instant...{:else}Rechercher{/if}</button>

  {#if results}
  {#if results.length === 0}
  <div class="col col--12of12"><em>Aucun résultats</em></div>
  {:else}
  <Tableau oeuvres={results} {lignes} />
  {/if}
  {/if}
</form>

<style lang="scss">
  form {
    align-items: flex-start;
    padding: $gap;

    aside {
      margin-top: $gap * 2;
      margin-bottom: $gap * -0.5;

      &:first-of-type {
        margin-right: auto;
      }
    }

    > fieldset {
      margin-bottom: $gap * 2;

      select {
        background-color: transparent;
      }

      .ligne {
        background-color: transparent;
        border: 1px solid;
        display: flex;
        justify-content: space-between;
        padding: ($base * 0.66) $base;
        padding-right: ($base * 0.66);
        border-radius: $base * 2;

        input[type=checkbox] {
          border-radius: 50%;
          background-color: transparent;

          &:checked {
            background-color: var(--couleur, $brown);
            border-color: transparent;
          }
        }
      }
    }

    input {
      &:not(:placeholder-shown) {
        color: $brown;
        background-color: $beige-dark;
      }
    }

    button {
      margin-left: auto;
    }
  }
</style>