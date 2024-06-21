<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  onMount(() => {
    document.documentElement.classList.add('noscroll')
  })

  onDestroy(() => {
    document.documentElement.classList.remove('noscroll')
  })
</script>

<span></span>