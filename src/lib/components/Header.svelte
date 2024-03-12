<script lang="ts">
  import { page } from '$app/stores'

  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  
  import Icon from './Icon.svelte'
  import Logo from './Logo.svelte'
  import Search from './Search.svelte'
  
  export let header: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  let searching = false
  let menu = false

  const click = () => {
    searching = false
    menu = false
  }
</script>

<header>
  <input type="checkbox" name="search" id="search" bind:checked={searching} />
  <label for="search"><Icon i="search" label="Recherche" /></label>

  <nav class="search">
    <Search visible={searching} />
  </nav>

  <input type="checkbox" name="menu" id="menu" bind:checked={menu} />
  <label for="menu"><Icon i="menu" label="Menu" /></label>

  <nav class="flex">
    <figure class="col col--6of12"><Logo /></figure>
    <ol class="col col--4of12">
      {#if header}
      {#each header.fields.liens as lien}
      <li>
        <a on:click={click} href="{lien.fields.route}"><Icon i="back" label="Naviguer vers" /> {lien.fields.titre} {#if $page.url.pathname === lien.fields.route}<small>(vous êtes ici)</small>{/if}</a>

        {#if lien.fields.sousLiens}
        <ol>
          {#each lien.fields.sousLiens as souslien}
          <li>
            <a on:click={click} href="{souslien.fields.route}"><Icon i="back" label="Naviguer vers" /> {souslien.fields.titre} {#if $page.url.pathname === souslien.fields.route}<small>(vous êtes ici)</small>{/if}</a>
          </li>
          {/each}
        </ol>
        {/if}
      </li>
      {/each}
      {/if}

      <li>
        <aside>
          <a href="/" class="button">Français</a>
          <a href="/en" class="button">English</a>
        </aside>
      </li>
    </ol>
  </nav>
</header>

<style lang="scss">
  header {
    position: fixed;
    z-index: 3000;
    top: 0;
    right: 0;
    padding: $base * $scale;

    display: flex;
    align-items: center;
    gap: $base;

    label[for="search"] {
      position: relative;
      z-index: -2;
    }

    nav {
      position: absolute;
      top: 0;
      right: 0;
      left: auto;
      height: 100vh;
      overflow-y: auto;
      width: calc(100vw - $base);
      z-index: -1;
      border: none;
      border-top-left-radius: $base * $scale;
      border-bottom-left-radius: $base * $scale;
      background-color: $yellow;
      padding: $base * $scale;
      box-shadow: 0px 0px 6px fade-out($color: $black, $amount: 0.85);

      transition: transform 666ms;
      will-change: transform;
      transform: translateX(100%);

      justify-content: space-between;

      &.search {
        background-color: $beige;
        z-index: -3;
      }

      figure {
        
        :global(svg) {
          height: 100%;
          width: auto;
        }
      }
      
      ol {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: $base;
        padding: ($base * $scale) 0;

        li {
          font-size: $base * $scale * 1.5;
          &:last-child {
            font-size: $base;
            margin-top: auto;
          }

          :global(svg) {
            vertical-align: top;
            height: 1em;
            width: 1em;
            opacity: 0;
            margin-left: -1.2em;

            transition: opacity 333ms, margin-left 333ms;
          }

          a:hover,
          a:focus {
            :global(svg) {
              opacity: 1;
              margin-left: 0;
            }

            + ol {
              height: auto;
              padding: ($base * $scale) 0;
            }
          }

          aside {
            display: flex;
            gap: $base;
          }

          ol {
            height: 0;
            padding: 0;
            overflow: hidden;
            margin-left: 1.2em;

            li {
              font-size: $base;
            }

            &:hover,
            &:has(a:focus) {
              height: auto;
              padding: ($base * $scale) 0;
            }
          }
        }
      }
    }

    input[type="checkbox"] {
      display: none;

      + label {
        cursor: pointer;
      }

      &:checked  {
        + label + nav {
          transform: translateX(0%);
        }
      }
    }
  }
</style>