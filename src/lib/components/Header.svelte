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
  import NoScroll from './NoScroll.svelte'
  import CommentairesPage from '../../routes/[[locale]]/commentaires/+page.svelte'
  import { up } from '$lib/stores'
  
  export let header: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  let searching = false
  let menu = false
  let commentaires = false

  let currentScroll = 0
	let scrollY = 0
  let menuScrollY = 0
  let menuCurrentScroll = 0

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

  const scroll = (menu=false) => {
    if (menu) {
      if ($up && menuScrollY > 0 && menuCurrentScroll < menuScrollY) {
        up.set(false)
      } else if (!$up && menuCurrentScroll > menuScrollY) {
        up.set(true)
      }
      
      menuCurrentScroll = menuScrollY
    } else {
      if ($up && scrollY > 0 && currentScroll < scrollY) {
        up.set(false)
      } else if (!$up && currentScroll > scrollY) {
        up.set(true)
      }
      
      currentScroll = scrollY
    }
  }
</script>

<svelte:window bind:scrollY on:scroll={() => scroll()} />

{#if searching || menu}
<NoScroll />
{/if}

<header class:up={$up} class:dark={($page.route.id === '/[[locale]]/oeuvres/[id]/zoom' || $page.route.id === '/[[locale]]/lignes/[id]/video') && !searching && !menu}>
  {#if $page.route.id !== '/[[locale]]' && $page.route.id !== '/[[locale]]/oeuvres/[id]/zoom' && $page.route.id !== '/[[locale]]/lignes/[id]/video'}
  <a href="/" class="h2"><Icon i="home" label="Accueil" /></a>
  {/if}

  <input type="checkbox" name="search" id="search" bind:checked={searching} on:input={() => menu = false} />
  <label for="search"><Icon i="search" label="Recherche" /></label>

  <nav class="search" on:scroll={e => {
    menuScrollY = e.currentTarget.scrollTop
    scroll(true)
  }}>
    <button class="button--none" on:click={() => searching = false}><Icon i="back" label="Fermer" /></button>
    <Search visible={searching} on:click={() => searching = false} />

    <button class="button--none" on:click={() => searching = false}><Icon i="back" label="Fermer" /> Fermer la fenêtre</button>
  </nav>

  <input type="checkbox" name="menu" id="menu" bind:checked={menu} on:input={() => searching = false} />
  <label for="menu"><Icon i={menu ? "menu-close" : "menu"} label="Menu" /></label>

  <nav class="flex" on:scroll={e => {
    menuScrollY = e.currentTarget.scrollTop
    scroll(true)
  }}>
    <figure class="col col--6of12 col--tablet--12of12"><a href="/" on:click={click}><Logo /></a></figure>
    <ol class="list--nostyle col col--4of12 col--tablet--12of12">
      {#if header}
      {#each header.fields.liens as lien}
      <li>
        <a on:click={click} href="{lien.fields.route}" on:click={(e) => {
          if (lien.fields.route === "/commentaires") {
            e.preventDefault()
            e.stopImmediatePropagation()
            menu = true
            commentaires = !commentaires
          } else {
            commentaires = false
          }
        }}><Icon i="back" label="Naviguer vers" /> {lien.fields.titre} {#if lien.fields.route !== "/" && $page.url.pathname === lien.fields.route}<small>(vous êtes ici)</small>{/if}</a>

        {#if lien.fields.sousLiens}
        <ol class="list--nostyle">
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

    @media (max-width: $mobile) {
      padding: ($mobile_gap);
    }

    > a,
    > label {
      transition: transform 666ms, color 666ms;
      transform: translateY(-100px);
    }

    a, label, input, nav {
      pointer-events: all;
    }

    &.up {
      > a,
      > label {
        transform: translateY(0%);
      }
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

    &.dark {
      color: $white;

      gap: 0;
      align-items: stretch;
      
      > label {
        background-color: fade-out($black, 0.33);
        display: flex;
        align-items: center;
        padding: $base * 0.5;
        border-radius: $base * 2;

        &:first-of-type {
          padding-left: $base;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        &:last-of-type {
          padding-right: $base;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }

    nav {
      position: absolute;
      top: 0;
      right: 0;
      left: auto;
      height: $vh;
      overflow-y: auto;
      width: 99vw;
      z-index: -1;
      border: none;
      border-top-left-radius: $base * $scale;
      border-bottom-left-radius: $base * $scale;
      color: $brown;
      background-color: $yellow;
      padding: $gap;
      box-shadow: 0px 0px 6px fade-out($color: $black, $amount: 0.85);

      transition: transform 666ms;
      will-change: transform;
      transform: translateX(100%);

      justify-content: space-between;

      @media (max-width: $mobile) {
        // width: 100vw;
        border-radius: 0;
        padding: $mobile_gap;
      }

      &.search {
        background-color: $beige;
        width: 90vw;
        padding-top: $gap * 6;
        // z-index: 3;

        @media (max-width: $tablet_landscape) {
          width: 95vw;
        }

        @media (max-width: $tablet_portrait) {
          width: 99vw;
        }

        > .button--none {

          &:first-child {
            position: absolute;
            top: $gap;
            left: $gap;
          }

          &:last-child {
            display: flex;
            align-items: center;
            gap: $mobile_gap * 0.5;
            margin-top: $mobile_gap;
            margin-bottom: $mobile_gap;

            @media (min-width: $tablet_portrait) {
              margin-left: $gap;
            }

            :global(svg) {
              height: 15px;
              width: 24px;
            }
          }
        }
      }

      figure {
        padding: $gap;
        
        :global(svg) {
          height: calc($vh - ($gap * 4));
          width: auto;
        }

        @media (orientation: portrait) {
          padding: $gap 0;
          order: 1;

          :global(svg) {
            height: auto;
            width: calc(100vw - ($gap * 4));
          }
        }
      }
      
      ol {
        display: flex;
        flex-direction: column;
        gap: $base;
        padding: ($gap) 0;

        @media (max-width: $mobile) {
          gap: $mobile_base;
          padding: 0;
        }

        li {
          a {
            font-size: $gap * 1.5;

            @media (max-width: $mobile) {
              font-size: $mobile_gap * 1.25;
            }
          }

          small {
            font-size: $base;
            margin-left: 0.5em;

            @media (max-width: $mobile) {
              font-size: $mobile_base;
              vertical-align: middle;
            }
          }

          :global(form) {
            padding-left: 0;

            @media (max-width: $mobile) {
              padding-right: 0;
            }
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

            @media (max-width: $tablet_portrait) {
              margin-top: $mobile_gap;
              margin-bottom: $mobile_gap * 2;

              aside {
                flex-direction: column;
                align-items: flex-start;

                a {
                  min-width: $mobile_base * 10;
                  justify-content: center;
                }
              }
            }
          }

          a :global(svg) {
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

              @media (max-width: $mobile) {
                font-size: $base + 2px;
              }
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