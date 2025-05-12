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

<ol class="list--nostyle {format} content">
{#each content as item, i}
  {#if isTypeGallerie(item)}
  <li class="gallerie" id={item.fields.id}>
    {#if i === 0}
    <figure role="heading" aria-level="1" class="logo" style:--height={898} style:--scroll={!innerHeight ? 0 : scrollY > innerHeight ? 1 : scrollY / innerHeight}>
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
    <ul class="list--nostyle">
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
    gap: 15vh;
  }
</style>