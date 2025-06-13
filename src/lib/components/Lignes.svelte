<script lang="ts">
  import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import Icon from './Icon.svelte'
  import { languageTag } from '$lib/paraglide/runtime';

  export let id: string
  export let current: number
  export let active: number = undefined
  export let lignes: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
  export let format: string = undefined

  let selected: string
  let visible: boolean = false
  let input: HTMLInputElement

  $: {
    selected = lignes[current].fields.id
  }
</script>

<form style:--current={current} style:--length={lignes.length} id="lignes" class:visible>
  <button type="button" on:click={(e) => {
    visible = !visible
  }} aria-expanded={visible ? "true" : "false"} aria-controls="lignes" aria-label={languageTag() === "en" ? "View exhibitions" : "Visionner les expositions"}>
    Exposition <Icon i="down" label={undefined} />
  </button>

  <ol class="list--nostyle" aria-label={languageTag() === "en" ? "List of exhibitions" : "Liste des expositions"}>
  {#each lignes as ligne, i}
    <li>
      <a href="/lignes/{ligne.fields.id}{format ? `?format=${format}` : ""}" aria-current={selected === ligne.fields.id ? "true" : undefined} on:click={() => input.checked = false} data-id={ligne.fields.id} on:mouseenter on:mouseleave>
        <label for={ligne.fields.id} role="presentation">
          {ligne.fields.titre}
          <input type="radio" bind:group={selected} value={ligne.fields.id} style:--color={ligne.fields.couleur}>
        </label>
      </a>
    </li>
  {/each}
  </ol>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;

    ol {
      display: flex;
      flex-direction: column;
    }

    label {
      display: flex;
      gap: $base;
    }

    input[type="radio"] {
      transition: background-color 333ms;

      &:checked {
        background-color: var(--color, currentColor) !important;
        border-color: transparent;
      }
    }

    @media (min-width: $mobile) {
      ol {
        gap: $base * 0.5;
      }

      button {
        display: none;
      }

      &:before {
        content: "";
        position: absolute;
        left: -3px;
        top: ($base * -0.2);
        height: calc(100% + 3px);
        width: ($base + 3px);
        border: 1.5px solid;
        border-radius: $base * 0.75;
      }

      label {
        gap: $base * 0.75;
        justify-content: flex-start;

        input[type="radio"] {
          order: -1;
          border-color: transparent;
          transform: scale(0.8);
        }

        &:hover,
        &:has(input:focus-visible) {
          input[type="radio"] {
            background-color: var(--color, currentColor) !important;
          }
        }
      }
    }

    @media (max-width: $mobile) {
      a,
      :global(svg) {
        display: none;
      }

      &.visible {
        background-color: $beige-dark;
        padding: $mobile_base;
        border-radius: $base;

        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;

        button {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border: none;
          padding: 0;
          padding-bottom: $mobile_base;
          background-color: transparent !important;
        }

        :global(svg) {
          display: block;
        }

        a {
          display: block;
          border-top: 1px solid;
          padding: ($mobile_base * 0.5) 0;

          // &:last-child {
          //   border-bottom: 1px solid;
          // }
        }
      }
    }
  }
</style>