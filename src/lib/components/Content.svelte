<script lang="ts">
  import { isTypeGallerie, isTypeText, type TypeGallerieSkeleton, type TypeTextSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import Media from './Media.svelte'
  import Document from './document/index.svelte'
  import Icon from './Icon.svelte';
  import { openDialog } from '$lib/helpers'

  export let content: Entry<TypeGallerieSkeleton | TypeTextSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]

  export let scrolled = false
</script>

<ol>
{#each content as item, i}
  {#if isTypeGallerie(item)}
  <li class="gallerie" id={item.fields.id}>
    {#if i < content.length - 1}
    <a href="#{content[i + 1].fields.id}" class:scrolled class="down"><Icon i="arrow" label="Plus bas" /></a>
    {/if}

    {#if item.fields.oeuvres?.length}
    <ul>
    {#each item.fields.oeuvres as oeuvre}
      <li>
        <a href="/oeuvres/{oeuvre.fields.id}" on:click={openDialog}>
          <figure>
            <Media media={oeuvre.fields.vignette} small />
            <figcaption>
              <p>{oeuvre.fields.artiste?.fields.nom}, {oeuvre.fields.titre}</p>
              <p>{oeuvre.fields.annee}, {oeuvre.fields.medium},<br />{oeuvre.fields.dimensions}</p>
              <p>Collection du Musée d’art 
              de Joliette ({oeuvre.fields.numero}),<br />
              {oeuvre.fields.mention}.</p>
            </figcaption>
          </figure>
        </a>
      </li>
    {/each}
    </ul>
    {/if}
  </li>
  {:else if isTypeText(item)}
  <li class="text" id={item.fields.id}>
    {#if item.fields.titre}
    {#if item.fields.titre.includes('|')}
    <h2 class="split">{#each item.fields.titre.split(' | ') as t}<span>{t}</span>{/each}</h2>
    {:else}
    <h2>{item.fields.titre}</h2>
    {/if}
    {/if}
    <Document body={item.fields.corps} />
  </li>
  {/if}
{/each}
</ol>

<style lang="scss">
  ol,
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $gap * 4;

    li {
      // width: 50%;

      &.gallerie {
        a.down {
          display: block;
          text-align: right;
          position: sticky;
          top: calc(100% + #{$gap});
          transform: translateY($gap * - 4);
          transition: opacity 666ms;

          &.scrolled {
            opacity: 0;
          }
        }

        ul {
          align-items: center;
          padding: $gap ($gap * 2);

          li {
            &:nth-child(2n) {
              align-self: flex-start;
            }

            &:nth-child(3n) {
              align-self: flex-end;
            }
          }
        }
        

        figure {
          display: flex;
          gap: $base;
          align-items: flex-end;

          :global(img),
          :global(video) {
            height: auto;
            max-height: 88vh;
            width: auto;
            max-width: 50vw;
            object-fit: contain;
          }

          figcaption {
            width: 210px;
            opacity: 0;
            transition: opacity 333ms;

            position: sticky;
            bottom: $base;

            font-size: $mobile_base;
          }
        }

        a {
          &:hover,
          &:focus {
            figcaption {
              opacity: 1;
            }
          }
        }
      }

      &.text {
        background-color: var(--background);
        padding: ($gap * 6) $gap;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $gap;

        > :global(*) {
          width: 100%;
          max-width: 1180px;
        }

        &:has(.split) > :global(*) {
          width: 50vw;
          max-width: 644px;
        }

        &:has(.split) > :global(p) {
          font-size: $base + 2px;
        }

        > :global(figure) {
          display: flex;
          width: calc(100vw - ($gap * 4));
          max-width: none;
          gap: $gap;
          align-items: flex-end;

          position: relative;
          left: 50%;
          transform: translateX(-50%);

          :global(img),
          :global(video) {
            width: auto;
            height: 50vw;
            object-fit: contain;
          }

          :global(figcaption) {
            width: $gap * 10;
          }

          &:nth-of-type(2n) {
            :global(figcaption) {
              order: -1;
            }
          }
        }

        > :global(h3),
        > :global(h4),
        > :global(h5) {
          margin: ($gap) 0 ($gap * 0.5);
        }

        > :global(table) {
          :global(td) {
            border: none;
            width: 50%;
            vertical-align: top;
            padding: ($gap) 0;

            > :global(p) {
              margin-bottom: $base;

              > :global(em) {
                display: inline-block;
                font-size: $base * $scale;
                font-style: normal;
                margin-bottom: $base * 0.25;
              }
            }
          }
        }

        .split {
          font-size: 9vw;
          position: sticky;
          top: 50%;
          transform: translateY(-50%);

          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: none;
          margin-bottom: -8vw;
        }
      }
    }
  }
</style>