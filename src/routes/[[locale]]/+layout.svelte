<script lang="ts">
  import '$lib/styles.scss'

  import { page } from '$app/stores'

  import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
  import Dialog from '$lib/components/Dialog.svelte'

  import type { LayoutData } from './$types'
	export let data: LayoutData
</script>

<svelte:head>
  {#if $page.data.page}
	<title>{$page.data.page.fields.titre}</title>
  {/if}
</svelte:head>

<Header header={data.header} />

<main class="{$page.route.id.replaceAll('/', '-').replaceAll('[', '').replaceAll(']', '')} {$page.url.pathname.replaceAll('/', '-')}">
  <slot />
</main>

<Dialog />
<Footer footer={data.footer} />

<style lang="scss">
  main {
    position: relative;
    z-index: 2;
    min-height: 90vh;
    background-color: $beige;
  }
</style>