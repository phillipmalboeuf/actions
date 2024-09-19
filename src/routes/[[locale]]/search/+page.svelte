<script lang="ts">
  import Search from '$lib/components/Search.svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<search>
  <Search query={data.query} from={Number(data.from)} to={Number(data.to)} artist={data.artist} medium={data.medium} results={data.results} annees={data.annees} artists={data.artists} mediums={data.mediums} />
</search>

<style lang="scss">
  search {
    padding: $gap;
    padding-top: $gap * 4;
    background-color: $beige;
  }
</style>