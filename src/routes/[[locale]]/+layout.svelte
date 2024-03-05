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
	<title>{$page.data.page.fields.title}</title>
  {/if}
</svelte:head>

<Header header={data.header} />

<main class={$page.route.id.replace('/[[locale]]/', '').replace('/[id]', '')}>
  <slot />
</main>

<Dialog />
<Footer />

<style lang="scss">
  main {
    min-height: 90vh;
  }
</style>