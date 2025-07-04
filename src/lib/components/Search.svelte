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
  import { languageTag } from '$lib/paraglide/runtime'

  export let visible = false
  export let main = false

  export let query: string = undefined
  export let artist: string[] = []
  export let medium: string[] = []
  export let from: number = 1920
  export let to: number = 2022
  export let lignes: { [id: string]: boolean } = $page.data.lignes.reduce((ls, ligne) => ({
    ...ls,
    [ligne.fields.id]: true
  }), {})
  export let results: (Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> & { ligne: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> })[] = undefined

  export let artists: EntryCollection<TypeArtisteSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
  export let annees: number[] = undefined
  export let mediums: string[] = undefined

  let timeout: NodeJS.Timeout
  let down: string = undefined
  let currentRequestId = 0

  $: {
    if (browser && !artists && visible) {
      preloadData(`${languageTag() === "en" ? "/en" : ""}/search`).then(result => {
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

    // Increment request ID to mark this as the latest request
    const requestId = ++currentRequestId
    waiting = true
      
    const path = (`${languageTag() === "en" ? "/en" : ""}/search?query=${e.currentTarget['query'].value}&artist=${artist.join(',')}&from=${e.currentTarget['from'].value}&to=${e.currentTarget['to'].value}&medium=${medium.join(',')}&lignes=${Object.entries(lignes).filter((([id, value]) => !!value)).map(([id, value]) => id)}`)
    
    try {
      const result = await preloadData(path)

      // Only process the result if this is still the latest request
      if (requestId === currentRequestId) {
        if (result.type === 'loaded' && result.status === 200) {
          // query = result.data.query
          artist = result.data.artist || []
          from = result.data.from
          to = result.data.to
          medium = result.data.medium || []
          results = result.data.results

          pushState(path, { search: result.data })
        } else {
          goto(path)
        }
      }
    } finally {
      // Only update waiting state if this is still the latest request
      if (requestId === currentRequestId) {
        waiting = false
      }
    }
  }

  const input: EventHandler<InputEvent, HTMLInputElement> = (e) => {
    // Increment request ID to mark any pending request as outdated
    currentRequestId++
    
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      form.requestSubmit()
    }, 333)
  }
</script>

<!-- <svelte:head>
  {#if results && results.length < 82}
  {#if results.length === 0}<title>Aucun résultat</title>{:else}<title>Recherche à {results.length} résultats</title>{/if}{/if}
</svelte:head> -->

<form class="flex flex--gapped" bind:this={form} action="/search" method="get" on:submit|preventDefault={submit}>
  <!-- <label for="query">Inscrire les termes recherchés</label> -->
  <input type="search" name="query" id="query" placeholder={languageTag() === "en" ? "Search" : "Rechercher"} aria-label={languageTag() === "en" ? "Search" : "Rechercher"} title={languageTag() === "en" ? "Search" : "Rechercher"} bind:value={query} on:input={input}>

  <aside class="col">
    <label for="artist">{languageTag() === "en" ? "Filters" : "Filtres"}</label>
    {#if results && results.length < 82}<a href="#resultats">{#if results.length === 0}{languageTag() === "en" ? "No results" : "Aucun résultat"}{:else}{languageTag() === "en" ? `See the ${results.length} results` : `Voir les ${results.length} résultats`}{/if}</a>{/if}
  </aside>

  <hr class="col col--12of12">

  <div class="col col--8of12 col--landscape--9of12 col--tablet--12of12 fields">
    <div class="flex flex--gapped">
      {#if artists}
      <div class="col col--4of12 col--mobile--12of12 dropdown" class:down={down === 'Artiste'}>
        <button type="button" class="button--none" aria-label={languageTag() === "en" ? "Filter by artist" : "Filtrer par artiste"} on:click={() => down = down === 'Artiste' ? undefined : 'Artiste'}>{languageTag() === "en" ? "Artist" : "Artiste"} <Icon i="down" label={undefined} /></button>
        <ol class="list--nostyle flex flex--tight_gapped" aria-label={languageTag() === "en" ? "Display alphabetically" : "Afficher de façon alphabétique"}>
          {#each ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].filter(l => artists.items.filter(a => a?.fields?.nomFamille).find(a => a.fields.nomFamille[0] === l)) as l}
          <li>
            <button type="button" class="button--none" on:click={() => {
              const label = document.querySelector(`label[data-letter=${l}]`)
              // @ts-ignore
              label.parentElement.scrollTo({ top: label.offsetTop, behavior: 'smooth' })
            }} aria-label={languageTag() === "en" ? `Scroll to ${l}` : `Faire défiler jusqu'à ${l}`}>{l}</button>
          </li>
          {/each}
        </ol>
        <div>
          {#each artists.items.filter(a => a?.fields?.nomFamille) as a}
          <label for="{main ? 'main' : 'dialog'}-artist-{a.fields.id}" data-letter={a.fields.nomFamille[0]}>
            {@html (a.fields.prenom ? `${a.fields.nomFamille}, ${a.fields.prenom}` : a.fields.nom)}
            <input type="checkbox" bind:group={artist} id="{main ? 'main' : 'dialog'}-artist-{a.fields.id}" value="{a.fields.id}"
              on:input={input}>
          </label>
          {/each}
        </div>
      </div>
      {/if}

      {#if mediums}
      <div class="col col--4of12 col--mobile--12of12 dropdown" class:down={down === 'Type'}>
        <button type="button" class="button--none" aria-label={languageTag() === "en" ? "Filter by medium" : "Filtrer par type d'oeuvre"} on:click={() => down = down === 'Type' ? undefined : 'Type'}>{languageTag() === "en" ? "Type" : "Type d'oeuvre"} <Icon i="down" label={undefined} /></button>
        <ol aria-hidden="true"></ol>
        <div>
          {#each mediums as m}
          <label for="{main ? 'main' : 'dialog'}-medium-{m}">
            {capitalize(m)}
            <input type="checkbox" bind:group={medium} id="{main ? 'main' : 'dialog'}-medium-{m}" value="{m}"
              on:input={input}>
          </label>
          {/each}
        </div>
      </div>
      {/if}

      {#if annees}
      <div class="col col--4of12 col--mobile--12of12 dropdown dropdown--wide" class:down={down === 'Année'}>
        <button type="button" class="button--none" on:click={() => down = down === 'Année' ? undefined : 'Année'} aria-label={languageTag() === "en" ? "Filter by period of production" : "Filtrer par période de réalisation"} >{languageTag() === "en" ? "Period of production" : "Période de réalisation"} <Icon i="down" label={undefined} /></button>
        <div>
          <div>
            <label for="{main ? 'main' : 'dialog'}-from">{languageTag() === "en" ? "From the year" : "À partir de l'année"}</label>
            <input type="number" aria-hidden="true"  class:default={Number(from) === 1920} bind:value={from}>
            <input type="range" name="from" id="{main ? 'main' : 'dialog'}-from" bind:value={from} min={1920} max={2022} on:input={input}>
            <span style:--left={`${(from - 1915) / (2027 - 1915) * 100}%`}>{from}</span>
          </div>
          <div>
            <label for="{main ? 'main' : 'dialog'}-to">{languageTag() === "en" ? "To the year" : "Jusqu'à l'année"}</label>
            <input type="number" aria-hidden="true" class:default={Number(to) === 2022} bind:value={to}>
            <input type="range" id="{main ? 'main' : 'dialog'}-to" name="to" bind:value={to} min={1920} max={2022} on:input={input}>
            <span style:--left={`${(to - 1925) / (2025 - 1925) * 100}%`}>{to}</span>
          </div>
        </div>
      </div>
      {/if}

      {#each $page.data.lignes as ligne}
      <div class="col col--4of12 col--mobile--12of12" style:--couleur={ligne.fields.couleur}>
        <label class="ligne" for="{main ? 'main' : 'dialog'}-ligne-{ligne.fields.id}">
          {ligne.fields.titre}
          <input type="checkbox" name="{ligne.fields.id}" id="{main ? 'main' : 'dialog'}-ligne-{ligne.fields.id}" checked={lignes[ligne.fields.id]} on:input={(e) => {
            lignes[ligne.fields.id] = e.currentTarget.checked
          }}>
        </label>
      </div>
      {/each}

      <div class="col">
        <ul class="list--nostyle flex flex--tight_gapped applied">
          {#each artist as f}
          <li>
            <button type="button" class="button--tight" on:click={() => {
              //@ts-ignore
              document.querySelector(`input[type=checkbox][value="${f}"]`).click()
            }}><span aria-label={languageTag() === "en" ? "Remove the filter" : "Retirer le filtre"}>X</span> {artists.items.find(a => a.fields.id === f).fields.nomFamille}, {artists.items.find(a => a.fields.id === f).fields.prenom}</button>
          </li>
          {/each}
          {#each medium as f}
          <li>
            <button type="button" class="button--tight" on:click={() => {
              //@ts-ignore
              document.querySelector(`input[type=checkbox][value="${f}"]`).click()
            }}><span aria-label={languageTag() === "en" ? "Remove the filter" : "Retirer le filtre"}>X</span> {capitalize(f)}</button>
          </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- <button class="button--inverse" type="submit">{#if waiting}Un instant...{:else}Rechercher{/if}</button> -->
  <button class="button--inverse" type="reset" on:click|preventDefault={async () => {
      query = undefined
      artist = []
      from = 1920
      to = 2022
      medium = []
      lignes = $page.data.lignes.reduce((ls, ligne) => ({
        ...ls,
        [ligne.fields.id]: true
      }), {})
      await tick()
      form.requestSubmit()
    }}>{languageTag() === "en" ? "Reset" : "Réinitialiser"}</button>

  {#if results}
  {#if results.length === 0}
  <div class="col col--12of12 empty" id="resultats"><em>{languageTag() === "en" ? "No results" : "Aucun résultat"}</em></div>
  {:else}
  <div class="col col--12of12" id="resultats"><Tableau oeuvres={results} {lignes} thumbnails on:click /></div>
  {/if}
  {/if}
</form>

<style lang="scss">
  form {
    align-items: flex-start;
    padding: $gap;

    @media (max-width: $mobile) {
      padding: 0;

      :global(table),
      :global(.empty) {
        margin-top: $mobile_gap * 2;
        // order: 99;
      }

      // button {
      //   order: 99;
      // }
    }

    aside {
      margin-top: $gap * 2;
      margin-bottom: $gap * -0.5;

      @media (max-width: $mobile) {
        margin-top: $mobile_gap * 2;
        margin-bottom: 0;
      }

      &:first-of-type {
        margin-right: auto;
      }

      @media (max-width: $mobile) {
        &:first-of-type {
          display: flex;
          width: 100%;
          justify-content: space-between;
        }

        &:last-of-type {
          margin-top: $mobile_gap;
          // order: 99;
          align-self: center;
        }
      }

      @media (min-width: $mobile) {
        a {
          display: none;
        }
      }
    }

    .fields {
      margin-bottom: $gap * 2;

      @media (max-width: $tablet_portrait) {
        margin-bottom: $mobile_gap * 0.5;
      }

      // select,
      .dropdown {
        border: 1px solid;
        background-color: transparent;
      }

      .dropdown {
        height: $base * 2.5;
        overflow: visible;
        // position: relative;
        // z-index: 3000;

        > button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 2px 0 ($base * 0.5);

          :global(svg) {
            transition: transform 333ms;
            transform: rotate(0);
          }
        }

        ol {
          position: relative;
          z-index: 2;
          display: none;
          width: auto;
          padding: $base $base ($base * 1.5);
          margin: 0 (($base * -1) - 1px);

          &:empty {
            padding-bottom: 0;
          }

          button {
            margin-left: 0;
          }
        }

        div {
          display: none;

          max-height: 50vh;
          overflow: auto;
          padding: 0 $base ($base * 2);
          margin: 0 (($base * -1) - 1px);
          border-bottom-left-radius: $base * 1.5;
          border-bottom-right-radius: $base * 1.5;

          label {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: $gap;

            line-height: 1.3;
            padding: ($base * 0.5) 0;
            border-top: 1px solid;

            &:last-child {
              border-bottom: 1px solid;
            }
          }
        }

        @media (hover: none) {
          &.down {
            background-color: $beige-dark;
            border-color: $beige-dark;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            button {
              :global(svg) {
                transform: rotate(-180deg);
              }
            }

            ol {
              display: flex;
              background-color: $beige-dark;
            }

            div {
              display: block;
              background-color: $beige-dark;
            }
          }
        }

        @media (hover: hover) and (pointer: fine) {
          &:hover,
          &:has(input:focus-visible),
          &.down {
            background-color: $beige-dark;
            border-color: $beige-dark;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            button {
              // pointer-events: none;

              :global(svg) {
                transform: rotate(-180deg);
              }
            }

            ol {
              display: flex;
              background-color: $beige-dark;
            }

            div {
              display: block;
              background-color: $beige-dark;
            }
          }
        }

        &.dropdown--wide {
          div {
            padding: ($gap) $base ($gap * 2);

            label {
              margin-top: ($base * 0.5);
              padding: ($base * 0.5) 0;
            }

            &:has(> div) {
              padding-bottom: $base * 0.25;
            }

            > div {
              position: relative;
              margin: 0 0 $base;
              padding: $base !important;
              background-color: $grey-ish !important;
              border-radius: $base;

              label {
                border-top: none;
                margin-top: 0;
                padding-top: 0;
                margin-bottom: $base * 0.5;
              }

              input[type="range"] {
                &::-webkit-slider-thumb {
                  background-color: $grey-ish;
                }
                &::-moz-range-thumb {
                  background-color: $grey-ish;
                }
              }

              input[type="number"] {
                position: absolute;
                top: $base * 0.95;
                right: $base * 0.75;
                background-color: $beige;
                width: $base * 3;
                padding: $base * 0.25;
                font-size: $base - 2px;
                text-align: center;

                &.default:not(:focus-visible) {
                  color: transparent;
                }

                -moz-appearance: textfield;

                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
              }
            }
          }

          @media (max-width: $mobile) {
            margin-bottom: $mobile_base;
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

    .button--tight {
      font-size: calc($base - 2px);
    }

    input {
      &:not(:placeholder-shown) {
        color: $brown;
        background-color: $beige-dark;
      }
    }

    button:not([type="button"]) {
      @media (min-width: $mobile) {
        margin-left: auto;
      }
    }

    .applied {
      button {
        display: flex;
        align-items: center;
        gap: $base * 0.5;

        span {
          order: 99;
        }
      }
    }
  }
</style>