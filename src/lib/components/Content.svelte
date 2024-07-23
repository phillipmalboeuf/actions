<script lang="ts">
  import { isTypeGallerie, isTypeText, type TypeGallerieSkeleton, type TypePageFields, type TypeTextSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import Media from './Media.svelte'
  import Document from './document/index.svelte'
  import Icon from './Icon.svelte'
  import Logo from './Logo.svelte'
  import Credit from './Credit.svelte'

  export let content: Entry<TypeGallerieSkeleton | TypeTextSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]
  export let format: TypePageFields['format']['values'] = undefined

  let scrollY = 0
  let innerHeight: number
</script>

<svelte:window bind:scrollY bind:innerHeight />

<ol class="list--nostyle {format}">
{#each content as item, i}
  {#if isTypeGallerie(item)}
  <li class="gallerie" id={item.fields.id}>
    {#if i === 0}
    <figure class="logo" style:--scroll={!innerHeight ? 0 : scrollY > innerHeight ? 1 : scrollY / innerHeight}>
      <!-- <figcaption>Actions collectives. Regards féministes sur la collection.</figcaption> -->
      <Logo />
    </figure>
    <figure class="maj">
      <Icon i="maj" label="Musée d'art de Joliette" />
    </figure>
    {/if}
    {#if i < content.length - 1}
    <a href="#{content[i + 1].fields.id}" class:scrolled={scrollY > 100} class="down"><Icon i="arrow" label="Plus bas" /></a>
    {/if}

    {#if item.fields.oeuvres?.length}
    <ul>
    {#each item.fields.oeuvres as oeuvre}
      <li>
        <!-- <a href="/oeuvres/{oeuvre.fields.id}" on:click={openDialog}></a> -->
        <figure>
          <Media media={oeuvre.fields.vignette} />
          <!-- <figcaption>
            <Credit {oeuvre} />
          </figcaption> -->
        </figure>
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
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $gap * 4;
  }

  ol {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $gap * 4;
    padding-left: 0;

    figure.logo {
      position: sticky;
      top: $gap;
      left: 0;
      // padding: $gap;
      z-index: -1;

      figcaption {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }

      :global(svg) {
        // padding: $gap;
        width: 100%;
        max-width: calc(100vw - ($gap * 2));
        transition: height 333ms;
        height: calc($vh - ($gap * 2));
        overflow: visible;
        object-position: left center;
        background-color: var(--background);

        @media (max-width: $tablet_portrait) {
          max-width: calc(66vw - ($mobile_gap * 2));
        }

        @media (max-width: $mobile) {
          max-width: calc(80vw - ($mobile_gap * 2));
        }

        :global(g) {
          will-change: transform;

          &:nth-child(2) {
            transform: translateX(calc((1 - var(--scroll, 0)) * 11vh));
          }

          &:nth-child(4) {
            transform: translateX(calc((1 - var(--scroll, 0)) * 23vh));
          }

          &:nth-child(6) {
            transform: translateX(calc((1 - var(--scroll, 0)) * 6.5vh));
          }

          @media (orientation: portrait) {

            &:nth-child(2) {
              transform: translateX(calc((1 - var(--scroll, 0)) * 22vw));
            }

            &:nth-child(4) {
              transform: translateX(calc((1 - var(--scroll, 0)) * 46vw));
            }

            &:nth-child(6) {
              transform: translateX(calc((1 - var(--scroll, 0)) * 13vw));
            }
          }
        }
      }

      ~ ul {
        margin-top: calc(($vh * -1) + ($gap * 4));
      }
    }

    figure.maj {
      position: absolute;
      top: calc(100% + ($gap * 2));
      right: $gap * 2;

      @media (max-width: $mobile) {
        right: auto;
        left: $gap;
      }
    }

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
            pointer-events: none;
            opacity: 0;
          }

          @media (max-width: $mobile) {
            position: fixed;
            top: $mobile_gap;
            left: $mobile_gap;
            transform: none;
          }
        }

        ul {
          // align-self: flex-end;
          gap: 35vh;
          padding: $gap ($gap * 2);

          @media (max-width: $mobile) {
            padding: $gap 0 50vh;
            gap: 66vh;
          }

          li {
            &:nth-child(2n) {
              align-self: flex-start;
            }

            &:nth-child(2n + 1) {
              align-self: flex-end;
            }

            &:nth-child(3n) {
              // align-self: center;
            }

            &:hover,
            &:focus {
              figcaption {
                opacity: 1;
              }
            }

            figure {
              display: flex;
              gap: $base;
              align-items: flex-end;

              :global(img),
              :global(video) {
                // height: auto;
                // flex: 1;
                // max-height: 50vh;
                width: auto;
                max-width: 33vw;
                max-height: 88vh;
                object-fit: contain;

                @media (max-width: $mobile) {
                  max-width: 66vw;
                }
              }

              figcaption {
                width: 210px;
                opacity: 0;
                transition: opacity 333ms;

                position: sticky;
                bottom: $base;

                font-size: $mobile_base;
              }

              @media (max-width: $mobile) {
                flex-direction: column;
                align-items: flex-start;
              }
            }

            // &:first-child {
            //   figure {
            //     flex-direction: column;
            //     align-items: flex-start;
            //     figcaption {
            //       margin-bottom: $gap * -4;
            //     }
            //   }
            // }

            &:nth-child(2n) {
              figure {
                :global(img),
                :global(video) {
                  max-width: 66vw;

                  @media (max-width: $mobile) {
                    max-width: 75vw;
                  }
                }
              }
            }
          }
        }
      }

      &.text {
        background-color: var(--background);
        padding: ($gap * 6) $gap;

        @media (max-width: $mobile) {
          padding: ($mobile_gap * 4) $mobile_gap;
        }

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $gap + 2px;

        > :global(*) {
          width: 50vw;
          max-width: 644px;

          @media (max-width: $mobile) {
            width: 100%;
          }
        }
        
        > :global(p),
        > :global(ul p),
        > :global(ol p),
        > :global(blockquote > p) {
          font-size: $base + 2px;
        }

        > :global(ul) {
          padding-left: 0;
          list-style: none;
        }

        > :global(h5) {
          font-size: ($base * $scale) + 4px;
        }
        
        > :global(table ~ p) {
          font-size: $base;

          @media (max-width: $mobile) {
            font-size: $base - 2px;
          }
        }

        > :global(figure) {
          display: flex;
          flex-direction: column;
          width: calc(100vw - ($base * 4));
          margin-left: $base * -1;
          max-width: none;
          gap: $gap * 0.5;
          align-items: flex-start;

          // position: relative;
          // left: 50%;
          // transform: translateX(-50%);

          @media (max-width: $mobile) {
            position: static;
            transform: none;
            width: 100%;
            margin-left: 0;
          }

          :global(img),
          :global(video) {
            width: auto;
            height: 50vw;
            object-fit: contain;

            @media (max-width: $mobile) {
              width: 100%;
              height: auto;
            }
          }

          :global(figcaption) {
            // width: $gap * 10;
            

            @media (max-width: $mobile) {
              width: 100%;
            }
          }

          &:nth-of-type(2n) {
            align-items: flex-end;

            @media (min-width: $mobile) {
              justify-content: flex-end;

              :global(figcaption) {
                // order: -1;
              }
            }
          }
        }

        > :global(h3),
        > :global(h4),
        > :global(h5) {
          // margin: ($gap) 0 ($gap);
        }

        > :global(table) {
          display: block;

          :global(tr) {
            @media (max-width: $mobile) {
              margin-bottom: $mobile_gap * 2;
            }
          }

          :global(td) {
            border: none;
            width: 50%;
            vertical-align: top;
            padding: ($gap) 0;

            @media (max-width: $mobile) {
              width: 100%;
              padding: 0;
              margin-bottom: 0;
            }

            > :global(p) {
              margin-bottom: $base;

              &:has(+ p > em:first-child),
              &:has(+ p > a) {
                margin-bottom: $base * 1.666;
              }

              :global(strong) {
                font-weight: 600;
              }

              > :global(u:first-child),
              > :global(strong:first-child > u) {
                display: inline-block;
                font-size: $base + 2px;
                font-style: normal;
                text-decoration: none;
                margin-bottom: $base * 0.25;
              }
            }
          }
        }

        > :global(h6) {
          :global(u) {
            text-decoration: none;
            font-size: $base + 2px;
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

    &.Medium {
      li.text {
        > :global(*:not(figure)) {
          width: 90vw;
          max-width: 840px;
        }
      }
    }

    &.Large {
      li.text {
        > :global(*:not(figure)) {
          width: 90vw;
          max-width: 980px;
        }
      }
    }
  }
</style>