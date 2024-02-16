<script lang="ts">
  import Icon from './Icon.svelte';
  import Logo from './Logo.svelte'

  // import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  // import type { Entry } from 'contentful'
  // export let footer: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
</script>

<footer>
  <nav></nav>
 
  <nav>
    <a href=""><Icon i="maj" label="Musée d'art de Joliette" /></a>
    <a href=""><Icon i="mnc" label="Musées numériques Canada" /></a>
  </nav>
  
</footer>

<style lang="scss">
  footer {
    position: relative;
    z-index: 999;
    // color: var(--foreground-inverse);
    background-color: var(--background);
    padding: $base;

    display: flex;
    justify-content: space-between;

    nav {
      display: inline-flex;
      align-items: center;
      gap: $gap;
    }
  }
</style>