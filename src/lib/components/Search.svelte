<script lang="ts">
  import { page } from '$app/stores'
  import { tick } from 'svelte'
  
  import type { Entry, EntryCollection } from 'contentful'
  import type { TypeArtisteSkeleton, TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import { goto, preloadData, pushState } from '$app/navigation'
  import { browser } from '$app/environment'
  import type { EventHandler } from 'svelte/elements'

  import Tableau from './Tableau.svelte'
  import Icon from './Icon.svelte'
  import { capitalize } from '$lib/formatters'

  export let visible = false

  export let query: string = undefined
  export let artist: string[] = []
  export let medium: string[] = []
  export let from: number = 1930
  export let to: number = 2020
  export let lignes: { [id: string]: boolean } = $page.data.lignes.reduce((ls, ligne) => ({
    ...ls,
    [ligne.fields.id]: true
  }), {})
  export let results: (Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> & { ligne: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> })[] = undefined

  export let artists: EntryCollection<TypeArtisteSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let annees: number[] = undefined
  export let mediums: string[] = undefined

  let timeout: NodeJS.Timeout

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
      
    const path = `/search?query=${e.currentTarget['query'].value}&artist=${artist.join(',')}&from=${e.currentTarget['from'].value}&to=${e.currentTarget['to'].value}&medium=${medium.join(',')}&lignes=${Object.entries(lignes).filter((([id, value]) => !!value)).map(([id, value]) => id)}`
    const result = await preloadData(path)

    if (result.type === 'loaded' && result.status === 200) {
      query = result.data.query
      artist = result.data.artist
      from = result.data.from
      to = result.data.to
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
    <a href="/search" on:click|preventDefault={async () => {
      query = undefined
      artist = undefined
      from = 1930
      to = 2020
      medium = undefined
      lignes = $page.data.lignes.reduce((ls, ligne) => ({
        ...ls,
        [ligne.fields.id]: true
      }), {})
      await tick()
      form.requestSubmit()
    }}>Réinitialisé</a>
  </aside>

  <hr class="col col--12of12">

  <fieldset class="col col--8of12">
    <div class="flex flex--gapped">
      {#if artists}
      <fieldset class="col col--4of12 dropdown">
        <label>Artiste <Icon i="down" label="Choix" /></label>
        <nav class="flex flex--tight_gapped">
          {#each ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].filter(l => artists.items.find(a => a.fields.nom[0] === l)) as l}
          <button class="button--none" on:click={() => {
            const label = document.querySelector(`label[data-letter=${l}]`)
            // @ts-ignore
            label.parentElement.scrollTo({ top: label.offsetTop - 125 })
          }}>{l}</button>
          {/each}
        </nav>
        <div>
          {#each artists.items as a}
          <label data-letter={a.fields.nom[0]}>
            {a.fields.nom}
            <input type="checkbox" bind:group={artist} value="{a.fields.id}"
              on:click={async (e) => {
                // if (a.fields.id === artist) {
                //   artist = undefined
                //   await tick()
                //   form.requestSubmit()
                // }
              }}
              on:input={(e) => {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                  form.requestSubmit()
                }, 666)
              }}>
          </label>
          {/each}
        </div>
        <!-- <select id="artist" name="artist" value={artist || ""} on:input={(e) => { form.requestSubmit() }}>
          <option value={""}>Artiste</option>
          {#each artists.items as artist}
          <option value={artist.fields.id}>{artist.fields.nom}</option>
          {/each}
        </select> -->
      </fieldset>
      {/if}

      {#if mediums}
      <fieldset class="col col--4of12 dropdown">
        <label>Type d'oeuvre <Icon i="down" label="Choix" /></label>
        <div>
          {#each mediums as m}
          <label>
            {capitalize(m)}
            <input type="checkbox" bind:group={medium} value="{m}"
              on:click={async (e) => {
                // if (m === medium) {
                //   medium = undefined
                //   await tick()
                //   form.requestSubmit()
                // }
              }}
              on:input={(e) => {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                  form.requestSubmit()
                }, 666)
              }}>
          </label>
          {/each}
        </div>
        <!-- <select name="medium" value={medium || ""} on:input={(e) => { form.requestSubmit() }}>
          <option value={""}>Type d'oeuvre</option>
          {#each mediums as medium}
          <option value={medium}>{capitalize(medium)}</option>
          {/each}
        </select> -->
        <!-- <Icon i="down" label="Select" /> -->
      </fieldset>
      {/if}

      {#if annees}
      <fieldset class="col col--4of12 dropdown dropdown--wide">
        <label>Année de production <Icon i="down" label="Choix" /></label>
        <div>
          <label for="from">À partir de</label>
          <input type="range" name="from" id="from" bind:value={from} min={1930} max={2020} on:input={(e) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              form.requestSubmit()
            }, 666)
          }}>
          <span style:--left={`${(from - 1925) / (2025 - 1925) * 100}%`}>{from}</span>

          <label for="from">Jusqu'à</label>
          <input type="range" name="to" id="to" bind:value={to} min={1930} max={2020} on:input={(e) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              form.requestSubmit()
            }, 666)
          }}>
          <span style:--left={`${(to - 1925) / (2025 - 1925) * 100}%`}>{to}</span>
        </div>
        <!-- <select name="annee" value={annee || ""} on:input={(e) => { form.requestSubmit() }}>
          <option value={""}>Année de production</option>
          {#each annees.filter(a => a) as annee}
          <option value={annee.toString()}>{annee}</option>
          {/each}
        </select>
        <Icon i="down" label="Select" /> -->
      </fieldset>
      {/if}

      {#each $page.data.lignes as ligne}
      <fieldset class="col col--4of12" style:--couleur={ligne.fields.couleur}>
        <label class="ligne">
          {ligne.fields.titre}
          <input type="checkbox" name="{ligne.fields.id}" checked={lignes[ligne.fields.id]} on:input={(e) => {
            lignes[ligne.fields.id] = e.currentTarget.checked
            form.requestSubmit()
          }}>
        </label>
      </fieldset>
      {/each}

      <div class="col">
        <div class="flex flex--tight_gapped">
          {#each artist as f}
          <button type="button" class="button--tight" on:click={() => {
            //@ts-ignore
            document.querySelector(`input[type=checkbox][value="${f}"]`).click()
          }}>{artists.items.find(a => a.fields.id === f).fields.nom} X</button>
          {/each}
          {#each medium as f}
          <button type="button" class="button--tight" on:click={() => {
            //@ts-ignore
            document.querySelector(`input[type=checkbox][value="${f}"]`).click()
          }}>{capitalize(f)} X</button>
          {/each}
      </div>
      </div>
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

      select,
      .dropdown {
        border: 1px solid;
        background-color: transparent;
      }

      .dropdown {
        height: $base * 2.5;
        overflow: visible;
        position: relative;
        z-index: 3000;

        > label {
          margin: 2px 0 ($base * 0.5);

          :global(svg) {
            transition: transform 333ms;
            transform: rotate(0);
          }
        }

        nav {
          display: none;
          width: auto;
          padding: $base $base ($base * 1.5);
          margin: 0 ($base * -1);

          button {
            margin-left: 0;
          }
        }

        div {
          display: none;

          max-height: 50vh;
          overflow: auto;
          padding: 0 $base $base;
          margin: 0 ($base * -1);
          border-bottom-left-radius: $base * 1.5;
          border-bottom-right-radius: $base * 1.5;

          label {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: $gap;
            padding: ($base * 0.5) 0;
            border-top: 1px solid;
          }
        }

        &:hover,
        &:has(input[focus]) {
          background-color: $beige-dark;
          border-color: $beige-dark;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;

          label {
            :global(svg) {
              transform: rotate(-180deg);
            }
          }

          nav {
            display: flex;
            background-color: $beige-dark;
          }

          div {
            display: block;
            background-color: $beige-dark;
          }
        }

        &.dropdown--wide {
          div {
            padding: ($gap) $base ($gap * 2);

            label {
              margin-top: ($base * 0.5);
              padding: ($base * 0.5) 0;
            }
          }

          &:hover,
          &:has(input[focus]) {

          }
        }
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
            background-color: var(--couleur, $brown) !important;
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