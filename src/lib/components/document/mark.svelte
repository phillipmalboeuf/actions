<script lang="ts">
  import type { Block, Inline, Text } from '@contentful/rich-text-types'
  export let mark: Block | Inline | Text
  export let tabled: boolean = false
</script>

{#if mark.nodeType === 'text'}
{#if mark.marks.length > 0}
  {#if mark.marks[0].type === 'italic'}
  <em><svelte:self mark={{ ...mark, marks: mark.marks.slice(1) }} /></em>
  {:else if mark.marks[0].type === 'superscript'}
  <sup><svelte:self mark={{ ...mark, marks: mark.marks.slice(1) }} /></sup>
  {:else if mark.marks[0].type === 'subscript'}
  <sub><svelte:self mark={{ ...mark, marks: mark.marks.slice(1) }} /></sub>
  {:else if mark.marks[0].type === 'bold'}
  <strong role={tabled ? "heading" : undefined} aria-level={tabled ? 2 : undefined}><svelte:self mark={{ ...mark, marks: mark.marks.slice(1) }} /></strong>
  {:else if mark.marks[0].type === 'underline'}
  <u role={tabled ? "heading" : undefined} aria-level={tabled ? 3 : undefined}><svelte:self mark={{ ...mark, marks: mark.marks.slice(1) }} /></u>
  {:else if mark.marks[0].type === 'code'}
  {@html mark.value}
  {/if}
{:else}
{@html mark.value}
{/if}
{:else if mark.nodeType === 'hyperlink'}
<a href="{mark.data.uri}" target="{mark.data.uri.indexOf('http') === 0 ? '_blank' : '_self'}">
  {#each mark.content as m}<svelte:self mark={m} />{/each}
</a>
{:else if mark.nodeType === 'entry-hyperlink'}
<a href="{mark.data.target.sys.contentType.sys.id}s/{mark.data.target.fields.identifier}">
  <u>{#each mark.content as m}<svelte:self mark={m} />{/each}</u>
</a>
{:else if mark.nodeType === 'asset-hyperlink'}
<a href="{mark.data.target.fields.file.url}" target="_blank">
  {#each mark.content as m}<svelte:self mark={m} />{/each}
</a>
{/if}