<script lang="ts">
  import { page } from '$app/stores'
  import Document from '$lib/components/document/index.svelte'
  import { fade, fly } from 'svelte/transition'
  import { goto, preloadData, pushState } from '$app/navigation'

  import type { TypeLooseTextSkeleton, TypeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import { api } from '$lib/api';
  
  export let header: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">

  let visible = false
  let about: Entry<TypeLooseTextSkeleton, "WITHOUT_UNRESOLVABLE_LINKS"> = undefined
</script>

<header class:visible on:pointerleave={() => visible = false}>
  <nav style="--length: {header.fields.links.length}">
    {#each header.fields.links as link}
    <div>
      <a href={link.fields.link} {...link.fields.external && { rel: "external", target: "_blank" }}
        class:active={$page.url.pathname !== '/' && link.fields.link !== '/' && $page.url.pathname.startsWith(link.fields.link)}
        on:click={async (e) => {
          if (link.fields.link !== '/contact') return;
          if (e.metaKey) return;

          e.preventDefault()
          const { href } = e.currentTarget
          const result = await preloadData(href)

          if (result.type === 'loaded' && result.status === 200) {
            pushState(href, { type: 'contact', open: result.data })
          } else {
            goto(href)
          }
        }}
        on:pointerenter={async () => {
          visible = true

          if (link.fields.link === "/about") {
            // @ts-ignore
            about = await api.get("/about")
          }
        }}
        on:pointerleave={() => about = undefined}>{link.fields.label}</a>

      {#if $page.data.films && link.fields.link === "/films"}
      <ol>
        {#each $page.data.films as film}
        <li><a href="/films/{film.fields.identifier}">{film.fields.title}</a></li>
        {/each}
      </ol>
      {/if}

      {#if $page.data.directors && link.fields.link === "/directors"}
      <ol>
        {#each $page.data.directors as director}
        <li><a href="/directors/{director.fields.tagIdentifier}">{director.fields.name}</a></li>
        {/each}
      </ol>
      {/if}

      {#if about && link.fields.link === "/about"}
      <aside transition:fade={{ duration: 333 }}><Document body={about.fields.body} /></aside>
      {/if}
    </div>
   
    {/each}
    <div><button on:click={()=> visible = !visible}>{#if visible}Fermer{:else}Menu{/if}</button></div>
  </nav>
</header>

<style lang="scss">
  header {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100vw;
    padding: $base 0;
    background-color: fade-out($white, 1);
    transition: height 666ms, background-color 666ms;
    pointer-events: none;

    &:not(.visible) {
      @supports (mix-blend-mode: exclusion) {
        color: white;
        mix-blend-mode: exclusion;
      }
    }

    nav {
      display: flex;

      &:has(a.active) a:not(.active) {
        opacity: 0.4;

        &:hover,
        &:focus {
          opacity: 1;
        }
      }

      &:not(:has(a.active)) a {
        opacity: 1 !important;

        &:hover,
        &:focus {
          opacity: 0.4 !important;
        }
      }

      a, button {
        pointer-events: auto;
      }

      a {
        transition: opacity 333ms;

        &.active {
          opacity: 1 !important;

          &:hover,
          &:focus {
            opacity: 0.4 !important;
          }

          + ol {
            a {
              opacity: 1 !important;

              &:hover,
              &:focus {
                opacity: 0.4 !important;
              }
            }
          }
        }
      }

      ol,
      aside {
        opacity: 0;
        visibility: hidden;
        transition: opacity 666ms;

        margin-top: $gap * 1.5;
        list-style: none;
        
        li {
          margin-bottom: $base * 0.5;
        }
      }

      div {
        width: calc(100% / var(--length));
        transition: border-color 666ms;
        padding: 0 ($base * 0.75);
        
        &:not(:first-child):not(:last-child) {
          border-left: 1px solid transparent;
        }

        aside {
          width: 175%;
        }

        &:nth-child(4) {
          // margin-left: calc(50% / var(--length));
        }

        &:nth-last-child(2) {
          border-color: transparent !important;
        }

        &:nth-child(n + 4) a {
          visibility: hidden;
          opacity: 0;
        }

        &:last-child {
          position: absolute;
          width: auto;
          top: $base * 0.83333333;
          right: 0;
        }
      }

      // div {
      //   position: absolute;
      //   top: $base - ($base * $scale * 0.125);
      //   right: $base - ($base * $scale * 0.333);
      // }
    }

    &.visible {
      background-color: fade-out($white, 0.5);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      pointer-events: auto;

      :global(html:has(.films)) & {
        background-color: fade-out($black-light, 0.5);
      }

      ol,
      aside {
        opacity: 1;
        visibility: visible;
      }

      nav div {
        &:not(:first-child) {
          border-color: fade-out($color: $black, $amount: 0.75);

          :global(html:has(.films)) & {
            border-color: fade-out($color: $white, $amount: 0.75);
          }
        }

        &:nth-child(n + 4) a {
          visibility: visible;
        }
      }
    }
  }
</style>