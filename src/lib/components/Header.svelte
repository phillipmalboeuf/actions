<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import { fade, fly } from 'svelte/transition'

  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  
  import Icon from './Icon.svelte'
  import Logo from './Logo.svelte'
  import Search from './Search.svelte'
  import CommentairesPage from '../../routes/[[locale]]/commentaires/+page.svelte'
  
  export let header: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  let searching = false
  let menu = false
  let commentaires = false

  let up = true
  let currentScroll = 0
	let scrollY = 0

  $: {
    if (browser) {
      document.documentElement.classList.toggle('noscroll', !!(menu || searching))
    }
  }

  onMount(() => {
    document.body.querySelectorAll("a[href='/commentaires']").forEach(a => a.addEventListener("click", (e) => {
      e.preventDefault()
      menu = true
      commentaires = true
    }))
  })

  const click = () => {
    searching = false
    menu = false
  }
</script>

<svelte:window bind:scrollY on:scroll={e => {
  if (up && scrollY > 0 && currentScroll < scrollY) {
		up = false
	} else if (!up && currentScroll > scrollY) {
		up = true
	}
	
	currentScroll = scrollY
}} />

<header class:up>
  {#if $page.route.id !== '/[[locale]]' && $page.route.id !== '/[[locale]]/oeuvres/[id]/zoom'}
  <a href="/" class="h2"><Icon i="home" label="Accueil" /></a>
  {/if}

  <input type="checkbox" name="search" id="search" bind:checked={searching} on:input={() => menu = false} />
  <label for="search"><Icon i="search" label="Recherche" /></label>

  <nav class="search">
    <Search visible={searching} />
  </nav>

  <input type="checkbox" name="menu" id="menu" bind:checked={menu} on:input={() => searching = false} />
  <label for="menu"><Icon i={menu ? "menu-close" : "menu"} label="Menu" /></label>

  <nav class="flex">
    <figure class="col col--6of12"><a href="/" on:click={click}><Logo /></a></figure>
    <ol class="col col--4of12">
      {#if header}
      {#each header.fields.liens as lien}
      <li>
        <a on:click={click} href="{lien.fields.route}" on:mouseenter={() => {
          // if (lien.fields.route === "/commentaires") {
          //   commentaires = true
          // } else {
          //   commentaires = false
          // }
        }}><Icon i="back" label="Naviguer vers" /> {lien.fields.titre} {#if lien.fields.route !== "/" && $page.url.pathname === lien.fields.route}<small>(vous êtes ici)</small>{/if}</a>

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
      {#if lien.fields.route === "/commentaires" && commentaires}
      <li transition:fly={{ y: 100 }}><CommentairesPage /></li>
      {/if}
      {/each}
      {/if}

      <li class="buttons">
        <aside>
          <a href="/" class="button">Français</a>
          <a href="/en" class="button">English</a>
        </aside>
      </li>
    </ol>
  </nav>
</header>

{#if menu || searching}
<button class="back" transition:fade={{ duration: 666 }} on:click={click}>
</button>
{/if}

<style lang="scss">
  header {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    width: 100%;
    padding: ($gap) ($gap * 2);
    pointer-events: none;

    display: flex;
    align-items: center;
    gap: $gap;

    transition: transform 666ms;
    transform: translateY(-100%);

    // a, label, input, nav {
    //   pointer-events: all;
    // }

    &.up {
      transform: translateY(0%);
    }

    label[for="search"] {
      position: relative;
      margin-left: auto;
    }

    > a.h2 {
      position: relative;
      z-index: -1;

      font-family: $display;
      font-weight: 300;
      text-transform: lowercase;
      line-height: 0;
    }

    nav {
      position: absolute;
      top: 0;
      right: 0;
      left: auto;
      height: 100vh;
      overflow-y: auto;
      width: 99vw;
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
        // z-index: 3;
      }

      figure {
        padding: $gap;
        
        :global(svg) {
          height: calc(100vh - ($gap * 4));
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
          a {
            font-size: $base * $scale * 1.5;
          }

          small {
            font-size: $base;
            margin-left: 0.5em;
          }

          :global(form) {
            padding-left: 0;
          }
          
          &.buttons {
            a { font-size: $base; }
            margin-top: auto;

            .button {
              &:hover,
              &:focus {
                color: $yellow;
                background-color: $brown;
              }
            }
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

            li a {
              font-size: ($base * $scale) + 2px;
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

  .back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: fade-out($color: $black, $amount: 0.66);
    border-radius: 0;
    padding: 0;
    border: none;
  }
</style>