<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit'
	import { i18n } from '$lib/i18n'
  import { languageTag } from '$lib/paraglide/runtime'

  import '$lib/styles.scss'
  import '$lib/content.scss'

  import { page } from '$app/stores'
  import type { PointerEventHandler } from 'svelte/elements'

  import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
  import Dialog from '$lib/components/Dialog.svelte'
  import Cookies from '$lib/components/Cookies.svelte'

  import type { LayoutData } from './$types'
	export let data: LayoutData

  const down: PointerEventHandler<Document> = (e) => {
    const target = (e.target as HTMLButtonElement)

    if (['BUTTON', 'A'].includes(target.nodeName)) {
      setTimeout(() => target.blur(), 0)
    }

    if (['BUTTON', 'A'].includes(target.parentElement.nodeName)) {
      setTimeout(() => target.parentElement.blur(), 0)
    }

    if (['BUTTON', 'A'].includes(target.parentElement.parentElement.nodeName)) {
      setTimeout(() => target.parentElement.parentElement.blur(), 0)
    }

    if (['BUTTON', 'A'].includes(target.parentElement.parentElement.parentElement.nodeName)) {
      setTimeout(() => target.parentElement.parentElement.parentElement.blur(), 0)
    }
  }
</script>

<svelte:head>
  {#if $page.data.page}
	<title>{$page.data.page.fields.titre}</title>
  {#if $page.data.page.fields.description}
  <meta name="description" content="{$page.data.page.fields.description}" />
  {/if}
  {/if}
</svelte:head>

<svelte:document on:pointerdown={down} />


<ParaglideJS {i18n}>
<a href="#main" class="skip">{languageTag() === "en" ? "Access main content" : "Accéder au contenu principal"}</a>

<Header header={data.header} />

<main id="main" class="{$page.route.id.replaceAll('/', '-').replaceAll('[', '').replaceAll(']', '')} {$page.url.pathname.replaceAll('/', '-')}">
  <slot />
</main>

<Dialog />
<Footer footer={data.footer} />

<Cookies />
</ParaglideJS>

<style lang="scss">
  main {
    position: relative;
    z-index: 2;
    min-height: 90vh;
    background-color: $beige;
  }

  .skip {
    position: absolute;
    top: 0;
    left: -100%;
    width: auto;
    display: flex;
    z-index: 10;

    &:focus {
      // right: auto;
      left: 0;
    }
  }
</style>