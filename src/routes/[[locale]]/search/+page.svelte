<script lang="ts">
  import Search from '$lib/components/Search.svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<main>
  <Search query={data.query} annee={data.annee} artist={data.artist} medium={data.medium} results={data.results} annees={data.annees} artists={data.artists} mediums={data.mediums} />
</main>

<style lang="scss">
  main {
    padding: $gap;
    padding-top: $gap * 4;
    background-color: $beige;
  }
</style>