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
      artist = result.data.artist || []
      from = result.data.from
      to = result.data.to
      medium = result.data.medium || []
      results = result.data.results

      pushState(path, { search: result.data })

      waiting = false
    } else {
      goto(path)
    }
  }
</script>

<svelte:head>
  {#if results && results.length < 82}
  {#if results.length === 0}<title>Aucun résultats</title>{:else}<title>Recherche à {results.length} résultats</title>{/if}{/if}
</svelte:head>

<form class="flex flex--gapped" bind:this={form} action="/search" method="get" on:submit|preventDefault={submit}>
  <!-- <label for="query">Inscrire les termes recherchés</label> -->
  <input type="search" name="query" id="query" placeholder="Rechercher" bind:value={query} on:input={(e) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      form.requestSubmit()
    }, 666)
  }}>

  <aside class="col">
    <label for="artist">Filtres</label>
    {#if results && results.length < 82}<a href="#resultats">{#if results.length === 0}Aucun résultats{:else}Voir les {results.length} résultats{/if}</a>{/if}
  </aside>

  <hr class="col col--12of12">

  <fieldset class="col col--8of12 col--tablet--12of12">
    <div class="flex flex--gapped">
      {#if artists}
      <fieldset class="col col--4of12 col--mobile--12of12 dropdown" class:down={down === 'Artiste'}>
        <button type="button" class="button--none" on:click={() => down = down === 'Artiste' ? undefined : 'Artiste'}>Artiste <Icon i="down" label="Choix" /></button>
        <nav class="flex flex--tight_gapped">
          {#each ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].filter(l => artists.items.filter(a => a?.fields?.nomFamille).find(a => a.fields.nomFamille[0] === l)) as l}
          <button type="button" class="button--none" on:click={() => {
            const label = document.querySelector(`label[data-letter=${l}]`)
            // @ts-ignore
            label.parentElement.scrollTo({ top: label.offsetTop, behavior: 'smooth' })
          }}>{l}</button>
          {/each}
        </nav>
        <div>
          {#each artists.items.filter(a => a?.fields?.nomFamille) as a}
          <label data-letter={a.fields.nomFamille[0]}>
            {@html (a.fields.prenom ? `${a.fields.nomFamille}, ${a.fields.prenom}` : a.fields.nom).replace('(', '<br>(')}
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
                }, 333)
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
      <fieldset class="col col--4of12 col--mobile--12of12 dropdown" class:down={down === 'Type'}>
        <button type="button" class="button--none" on:click={() => down = down === 'Type' ? undefined : 'Type'}>Type d’oeuvre <Icon i="down" label="Choix" /></button>
        <nav></nav>
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
                }, 333)
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
      <fieldset class="col col--4of12 col--mobile--12of12 dropdown dropdown--wide" class:down={down === 'Année'}>
        <button type="button" class="button--none" on:click={() => down = down === 'Année' ? undefined : 'Année'}>Période de réalisation <Icon i="down" label="Choix" /></button>
        <div>
          <div>
            <label for="from">À partir de</label>
            <input type="number" class:default={Number(from) === 1920} bind:value={from}>
            <input type="range" name="from" id="from" bind:value={from} min={1920} max={2022} on:input={(e) => {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                form.requestSubmit()
              }, 333)
            }}>
            <span style:--left={`${(from - 1915) / (2027 - 1915) * 100}%`}>{from}</span>
          </div>
          <div>
            <label for="from">Jusqu’à</label>
            <input type="number" class:default={Number(to) === 2022} bind:value={to}>
            <input type="range" name="to" id="to" bind:value={to} min={1920} max={2022} on:input={(e) => {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                form.requestSubmit()
              }, 666)
            }}>
            <span style:--left={`${(to - 1925) / (2025 - 1925) * 100}%`}>{to}</span>
          </div>
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
      <fieldset class="col col--4of12 col--mobile--12of12" style:--couleur={ligne.fields.couleur}>
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
          <button type="button" class="button--tight" aria-label="Retirer" on:click={() => {
            //@ts-ignore
            document.querySelector(`input[type=checkbox][value="${f}"]`).click()
          }}>{artists.items.find(a => a.fields.id === f).fields.nomFamille}, {artists.items.find(a => a.fields.id === f).fields.prenom} &nbsp;X</button>
          {/each}
          {#each medium as f}
          <button type="button" class="button--tight" aria-label="Retirer" on:click={() => {
            //@ts-ignore
            document.querySelector(`input[type=checkbox][value="${f}"]`).click()
          }}>{capitalize(f)} &nbsp;X</button>
          {/each}
      </div>
      </div>
    </div>
  </fieldset>

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
    }}>Réinitialiser</button>

  {#if results}
  {#if results.length === 0}
  <div class="col col--12of12 empty" id="resultats"><em>Aucun résultats</em></div>
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

    > fieldset {
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

        nav {
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

        @media (min-width: $mobile) {
          &:hover,
          &:has(input[focus]) {
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

            nav {
              display: flex;
              background-color: $beige-dark;
            }

            div {
              display: block;
              background-color: $beige-dark;
            }
          }
        }

        @media (max-width: $mobile) {
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

            nav {
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

                &.default {
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
  }
</style>