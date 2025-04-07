<script lang="ts">
  // import Gallery from '../Gallery.svelte'
  import Media from '../Media.svelte'
  import Mark from './mark.svelte'

  import { page } from '$app/stores'

  import { openDialog } from '$lib/helpers';
  import Icon from '../Icon.svelte';

  import type { TopLevelBlock } from '@contentful/rich-text-types'
  export let node: TopLevelBlock
</script>

{#if node.nodeType === 'heading-2'}
  <h2>{#each node.content as mark}<Mark mark={mark} />{/each}</h2>
{:else if node.nodeType === 'heading-3'}
  <h3>{#each node.content as mark}<Mark mark={mark} />{/each}</h3>
{:else if node.nodeType === 'heading-4'}
  <h4>{#each node.content as mark}<Mark mark={mark} />{/each}</h4>
{:else if node.nodeType === 'heading-5'}
  <h5>{#each node.content as mark}<Mark mark={mark} />{/each}</h5>
{:else if node.nodeType === 'heading-6'}
  <h6>{#each node.content as mark}<Mark mark={mark} />{/each}</h6>
{:else if node.nodeType === 'paragraph'}
  <p>{#each node.content as mark}<Mark mark={mark} />{/each}</p>
{:else if node.nodeType === 'hr'}
  <hr />

{:else if node.nodeType === 'ordered-list'}
  <ol>
    {#each node.content as item}<li>{#each item.content as node}<svelte:self node={node} />{/each}</li>{/each}
  </ol>

{:else if node.nodeType === 'unordered-list'}
  <ul>
    {#each node.content as item}<li>{#each item.content as node}<svelte:self node={node} />{/each}</li>{/each}
  </ul>

{:else if node.nodeType === 'table'}
  <table>
    {#each node.content as item}<tr>{#each item.content as node}<svelte:self node={node} />{/each}</tr>{/each}
  </table>
{:else if node.nodeType === 'table-header-cell'}
  <th data-content="{node.content[0]?.content[0]?.value}">{#each node.content as item}<svelte:self node={item} />{/each}</th>
{:else if node.nodeType === 'table-cell'}
  <td>{#each node.content as item}<svelte:self node={item} />{/each}</td>

{:else if node.nodeType === 'blockquote'}
  <blockquote>{#each node.content as code}<svelte:self node={code} />{/each}</blockquote>

{:else if node.nodeType === 'embedded-asset-block'}
  <figure>
    <Media media={node.data.target} title />
    {#if node.data.target.fields.description}
    <figcaption class="flex flex--gapped">
      <div>{node.data.target.fields.description}</div>
      {#if $page.data.oeuvre || $page.state.type === 'oeuvre'}
      {@const oeuvre = $page.data.oeuvre || $page.state.open.oeuvre}
      <div>
        <a href="/oeuvres/{oeuvre.fields.id}/archives/{node.data.target.sys.id}/zoom" on:click={openDialog}><Icon i="view" label="Zoom" /></a>
      </div>
      {/if}
    </figcaption>
    {/if}
  </figure>
{:else if node.nodeType === 'embedded-entry-block'}
  <!-- {#if node.data.target.sys.contentType.sys.id === 'collaboratorSlider'}
  {#if !$page.data.isMobile}
  <Gallery images={node.data.target.fields.collaborators.map(collaborator => ({
    thumbnail: collaborator.fields.photo,
    content: collaborator.fields,
    href: collaborator.fields.tagIdentifier && `films?director=${collaborator.fields.tagIdentifier}`
  }))}>
    <h6 slot="content" let:content={content}>
      {#if content.tagIdentifier}<a href={`films?director=${content.tagIdentifier}`}>{content.name}</a>{:else}{content.name}{/if}<br />
      {content.profession}<br />
    </h6>
  </Gallery>
  {:else}
  <div style="margin: 2rem 0">
  {#each node.data.target.fields.collaborators as collaborator}
  <a href="{collaborator.fields.tagIdentifier && `films?director=${collaborator.fields.tagIdentifier}`}">
    <h2>{collaborator.fields.name}</h2>
  </a>
  {/each}
  </div>
  {/if}
  {/if} -->
{/if}


<style lang="scss">
  figure {
    margin: ($gap * 2) 0;

    figcaption {
      font-size: $base - 2px;
      line-height: 1.15;
      flex-wrap: nowrap;;
    }

    :global(img),
    :global(video) {
      max-height: 60svh;
      object-fit: contain;
    }

    @media (max-width: $mobile) {
      margin: ($mobile_gap * 1.5) 0;
    }
  }

  ol,
  ul {
    // padding-left: 1.5em;
    li {
      &:not(:last-child) {
        margin-bottom: $base * 0.25;
      }
    }
  }

  h4,
  h5,
  h6 {
    // padding-right: 25%;
  }

  table {
    @media (max-width: $mobile) {
      :global(tr) {
        display: flex;
        flex-direction: column;
      }

      :global(th),
      :global(td) {
        display: block;
        width: 100% !important;
        padding: 0;
        margin-bottom: $mobile_gap;
      }
    }
  }
</style>