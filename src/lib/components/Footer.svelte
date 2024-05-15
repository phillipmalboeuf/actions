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
      <form action="/infolettre">
        <strong>Infolettre</strong>
        <input type="text" name="nom" autocomplete="name" placeholder="Nom">
        <input type="email" name="email" autocomplete="email" placeholder="Courriel">
        <button class="button--inverse" type="submit"><svg width="22" height="22" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.582 0C16.5822 3.37758 17.7411 6.65286 19.8652 9.27892C21.9893 11.905 24.9501 13.7229 28.253 14.429V15.073C24.9504 15.7791 21.9899 17.5967 19.8659 20.2223C17.7418 22.848 16.5827 26.1228 16.582 29.5" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10"/><path d="M28.547 14.751H0" stroke="#FCFAF2" stroke-width="1.75"/></svg></button>
      </form>
      <a href=""><Icon i="maj" label="Musée d'art de Joliette" /></a>
      <a href=""><Icon i="mnc" label="Musées numériques Canada" /></a>
      <small>©{new Date().getFullYear()}<br>Musée d’art<br>de Joliette</small>
    </nav>
  </main>
</footer>

<style lang="scss">
  footer {
    position: relative;
    z-index: 998;
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

      form {
        display: flex;
        align-items: center;
        width: 50%;
        margin-right: auto;

        strong {
          margin-right: $base;
        }

        input {
          background-color: transparent;
          border: 1.5px solid;
          padding: $base * 0.5;

          &:first-of-type {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }

          &:last-of-type {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: none;
          }
        }

        button {
          display: flex;
          padding: $base * 0.5;
          // height: $base;
          // width: $base;
          border-radius: 50%;
          border: none;
          margin-left: $base * -2;
        }
      }
    }
  }
</style>