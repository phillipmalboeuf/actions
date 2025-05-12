<script lang="ts">
  import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import Icon from './Icon.svelte'

  export let id: string
  export let current: number
  export let active: number = undefined
  export let lignes: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
  export let format: string = undefined

  let selected: string
  let input: HTMLInputElement

  $: {
    selected = lignes[current].fields.id
  }
</script>

<form style:--current={current} style:--length={lignes.length}>
  <label class="button" for={id} role="presentation">
    Exposition <Icon i="down" label="Sélection" />
    <input type="checkbox" class="exposition" id={id} bind:this={input}>
  </label>

  {#each lignes as ligne, i}
  <a href="/lignes/{ligne.fields.id}{format ? `?format=${format}` : ""}" aria-current={selected === ligne.fields.id ? "true" : undefined} on:click={() => input.checked = false} data-id={ligne.fields.id} on:mouseenter on:mouseleave>
    <label for={ligne.fields.id} role="presentation">
      {ligne.fields.titre}
      <input type="radio" bind:group={selected} value={ligne.fields.id} style:--color={ligne.fields.couleur}>
    </label>
  </a>
  {/each}
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;

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
      gap: $base * 0.5;

      label.button {
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
        &:has(input:focus) {
          input[type="radio"] {
            background-color: var(--color, currentColor) !important;
          }
        }
      }
    }

    @media (max-width: $mobile) {
      input.exposition {
        display: none;
      }

      a,
      :global(svg) {
        display: none;
      }

      &:has(input.exposition:checked) {
        background-color: $beige-dark;
        padding: $mobile_base;
        border-radius: $base;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        .button {
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

          &:last-child {
            border-bottom: 1px solid;
          }
        }
      }
    }
  }
  // ul {
  //   position: relative;
  //   list-style: none;
  //   padding-left: $gap * 1.25;

  //   &:before {
  //     content: "";
  //     position: absolute;
  //     left: 0;
  //     top: ($base * -0.2);
  //     height: 100%;
  //     width: $base;
  //     border: 1.5px solid;
  //     border-radius: $base * 0.75;
  //   }

  //   li {
  //     position: relative;

  //     &.current {
  //       &:before {
  //         content: "";
  //         background-color: var(--current-color);
  //         border-radius: 50%;
  //         width: $base - 4px;
  //         height: $base - 4px;
  //         // margin: $base * 0.3;
  //         position: absolute;
  //         right: calc(100% + ($gap * 0.5) - ($gap * 0.15 / 3));
  //         top: 0;
  //       }
  //     }
  //   }
    
  // }
</style>