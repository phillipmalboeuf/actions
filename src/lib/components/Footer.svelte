<script lang="ts">
  import Icon from './Icon.svelte';
  import Logo from './Logo.svelte'

  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  export let footer: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<footer class="flex flex--gapped">
  <figure class="col col--3of12"><Logo /></figure>

  <main class="col col--9of12">
    <ol class="list--nostyle flex flex--gapped">
      {#if footer}
      {#each footer.fields.liens as lien}
      <li>
        <a href="{lien.fields.route}">{lien.fields.titre}</a>

        {#if lien.fields.sousLiens}
        <ol>
          {#each lien.fields.sousLiens as souslien}
          <li>
            <a href="{souslien.fields.route}">{souslien.fields.titre}</a>
          </li>
          {/each}
        </ol>
        {/if}
      </li>
      {/each}
      {/if}
    </ol>
    <nav class="flex flex--gapped">
      <a href=""><Icon i="maj" label="Musée d'art de Joliette" /></a>
      <a href=""><Icon i="mnc" label="Musées numériques Canada" /></a>
      <small>©{new Date().getFullYear()}<br>Musée d’art<br>de Joliette</small>
    </nav>
  </main>
</footer>

<style lang="scss">
  footer {
    position: relative;
    z-index: 999;
    // color: var(--foreground-inverse);
    background-color: var(--background);
    padding: $gap ($gap * 2) ($gap * 2);

    :global(.-pages-credits) ~ &,
    :global(.-pages-bibliographie) ~ & {
      --background: #{$yellow};
      background-color: var(--background);
    }

    main {
      display: flex;
      flex-direction: column;
    }

    ol {
      list-style: none;
      padding: 0;

      li {
        flex: 1;

        ol {
          li {
            margin: $gap 0;
          }
        }
      }
    }

    nav {
      margin-top: auto;
      justify-content: flex-end;
      gap: $gap * 2;

      small {
        text-align: right;
      }
    }
  }
</style>