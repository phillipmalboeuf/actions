<script lang="ts">
  import type { TypeLigneSkeleton, TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'

  export let current: number
  export let lignes: Entry<TypeLigneSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">[]
  export let format: string = undefined
</script>

<ul style:--current={current} style:--current-color={lignes[current].fields.couleur} style:--length={lignes.length}>
  {#each lignes as ligne, i}
  <li class:current={current === i}>
    <a href="/lignes/{ligne.fields.id}{format ? `?format=${format}` : ""}">{ligne.fields.titre}</a>
  </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    position: relative;
    list-style: none;
    padding-left: $gap * 1.25;

    display: flex;
    flex-direction: column;
    gap: $base * 0.5;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: ($base * -0.2);
      height: 100%;
      width: $base;
      border: 1.5px solid;
      border-radius: $base * 0.75;
    }

    li {
      position: relative;

      &.current {
        &:before {
          content: "";
          background-color: var(--current-color);
          border-radius: 50%;
          width: $base - 4px;
          height: $base - 4px;
          // margin: $base * 0.3;
          position: absolute;
          right: calc(100% + ($gap * 0.5) - ($gap * 0.15 / 3));
          top: 0;
        }
      }
    }
    
  }
</style>