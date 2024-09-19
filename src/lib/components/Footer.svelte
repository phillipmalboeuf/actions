<script lang="ts">
  import Icon from './Icon.svelte';
  import Logo from './Logo.svelte'

  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  export let footer: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<footer class="flex flex--gapped">
  <figure class="col col--3of12 col--mobile--12of12"><a href="/"><Logo /></a></figure>

  <main class="col col--9of12 col--tablet--12of12">
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
      <form action="https://museejoliette.us7.list-manage.com/subscribe/post?locale=fr" method="post" target="_blank">
        <input type="hidden" name="u" value="0e4b3fa9c3ebd26a49760574a">
        <input type="hidden" name="id" value="8529eaf024">
        <strong>Infolettre</strong>
        <input type="text" name="MERGE1" autocomplete="name" placeholder="Nom">
        <input type="email" name="MERGE0" autocomplete="email" placeholder="Courriel">
        <button class="button--inverse" type="submit"><svg width="22" height="22" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.582 0C16.5822 3.37758 17.7411 6.65286 19.8652 9.27892C21.9893 11.905 24.9501 13.7229 28.253 14.429V15.073C24.9504 15.7791 21.9899 17.5967 19.8659 20.2223C17.7418 22.848 16.5827 26.1228 16.582 29.5" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10"/><path d="M28.547 14.751H0" stroke="#FCFAF2" stroke-width="1.75"/></svg></button>
      </form>
      <a href="https://www.museejoliette.org/fr/" target="_blank" rel="external"><Icon i="maj" label="Musée d'art de Joliette" /></a>
      <a href="https://www.museesnumeriques.ca" target="_blank" rel="external"><Icon i="mnc" label="Musées numériques Canada" /></a>
      <small>©{new Date().getFullYear()}<br> Musée d’art<br> de Joliette</small>
    </nav>
  </main>
</footer>

<style lang="scss">
  footer {
    position: -webkit-sticky;
    position: sticky;
    z-index: 0;
    bottom: 0;
    // color: var(--foreground-inverse);
    font-size: $base - 2px;
    background-color: var(--background);
    padding: ($gap * 2) ($gap * 2) ($gap * 2);
    backface-visibility: hidden;
    overflow-x: hidden;

    @media (max-width: $tablet_portrait) {
      gap: ($mobile_gap * 3);
    }

    @media (max-width: $mobile) {
      padding: ($mobile_gap * 2) ($mobile_gap) ($mobile_gap * 2);
    }

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

      @media (max-width: $mobile) {
        display: none;
      }
    }

    nav {
      margin-top: auto;
      justify-content: flex-end;
      gap: $gap * 2;

      small {
        text-align: right;

        @media (max-width: $mobile) {
          text-align: center;
          width: 100%;

          br {
            display: none;
          }
        }
      }

      form {
        display: flex;
        align-items: center;
        width: 50%;
        margin-right: auto;

        @media (max-width: $mobile) {
          flex-wrap: wrap;
          width: 100%;
          row-gap: $mobile_gap;
        }

        strong {
          margin-right: $base;

          @media (max-width: $mobile) {
            margin: 0 auto;
          }
        }

        input {
          background-color: transparent;
          border: 1.5px solid;
          padding: $base * 0.666;
          border-radius: $base * 1.25;

          &[type="text"] {

            @media (min-width: $mobile) {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              border-right: none;
            }

            @media (max-width: $mobile) {
              width: 100%;
            }
          }

          &[type="email"] {
            @media (min-width: $mobile) {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }

          &:not(:placeholder-shown) {
            color: $brown;
            background-color: $white;
            border-color: transparent;
          }
        }

        button {
          display: flex;
          padding: $base * 0.6;
          // height: $base;
          // width: $base;
          border-radius: 50%;
          border: none;
          margin-left: $base * -2.5;
          margin-right: $base * -2.5;
        }
      }

      @media (max-width: $mobile) {
        a {
          max-width: 40%;
          &:last-of-type {
            margin-left: auto;
          }

          :global(svg) {
            max-width: 100%;
          }
        }
      }
    }
  }
</style>