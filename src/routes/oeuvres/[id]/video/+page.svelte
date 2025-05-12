<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import type { MouseEventHandler } from 'svelte/elements'

  import Icon from '$lib/components/Icon.svelte'
  import Document from '$lib/components/document/index.svelte'

  import type { PageData } from './$types' 
  export let data: PageData

  export let onClose: MouseEventHandler<HTMLAnchorElement> = undefined
  // let ready = false

  onMount(() => {
    browser && document.documentElement.classList.add('noscroll')
  })

  onDestroy(() => {
    browser && document.documentElement.classList.remove('noscroll')
  })
</script>

<dialog transition:fly={{ opacity: 1, y: '-100%', duration: 666 }}>
  <a href="/oeuvres/{data.oeuvre.fields.id}" on:click={(e) => {
    if (onClose) {
      e.preventDefault()
      onClose(e)
    }
  }}><Icon i="close" label="Fermer" /></a>
  <div class="flex flex--column flex--gapped">
    <p>{data.oeuvre.fields.titre} {data.oeuvre.fields.artiste?.fields.nom} {#if data.oeuvre.fields.description}/ <em>{@html data.oeuvre.fields.description}</em>{/if} </p>
    <iframe src={data.oeuvre.fields.lienVideo ? data.oeuvre.fields.lienVideo : "https://www.youtube.com/embed/nbWzqumlcK0?si=_BXSld-HTxc565iJ"} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    <small>
      {#if data.oeuvre.fields.droits}
      <p>{data.oeuvre.fields.droits}</p>
      {/if}
    </small>

    <input type="checkbox" name="transcription" id="transcription" on:input={(e) => {
    e.currentTarget.blur()
    }} />
    <label for="transcription">
      <span class="back"><Icon i="back" label="Fermer" /></span>
      <span class="button">transcription</span>
    </label>

    <aside>
      {#if data.oeuvre.fields.transcription}
      <Document body={data.oeuvre.fields.transcription} />
      {:else}
      <p>Aucune transcription disponible pour cette vidéo.</p>
      {/if}
    </aside>
  </div>
</dialog>

<style lang="scss">
  dialog {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: $vh;
    overflow-x: hidden;
    
    z-index: 3000;
    border: none;

    color: $white;
    background-color: $black;
    padding: ($gap * 4) ($gap * 2) ($gap * 2);

    div {
      max-width: 1020px;
      margin: auto;
    }

    iframe {
      width: 100%;
      height: calc($vh - ($gap * 6));
    }

    > a {
      display: flex;
      position: absolute;
      top: $base;
      left: ($gap * 2);
      z-index: 4001;
      background: none;
      padding: 0;
      color: $white;
      // margin-bottom: $gap;
      background-color: fade-out($black, 0.33);
      padding: $base * 0.5;
      border-radius: 50%;

      @media (max-width: $mobile) {
        left: ($mobile_gap * 1);
      }
    }

    input[name="transcription"] {
      display: none;

      & + label {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(90vw);
        max-width: 420px;
        padding: $gap calc($gap * 2);
        z-index: 4001;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: $gap;

        .back {
          display: none;
          transition: padding-left 0.333s;

          &:hover {
            padding-left: $gap;
          }
        }
      }

      &:checked + label {
        justify-content: space-between;

        .button {
          color: $black;
          border-color: transparent;
          pointer-events: none;
        }

        .back {
          display: inline-block;
          color: $black;
          cursor: pointer;
        }
      }

      &:checked ~ aside {
        transform: translateX(0);
      }
    }

    aside {
      padding: calc($gap * 2);
      padding-top: calc($gap * 4);
      background-color: $beige-dark;
      color: $black;
      border-radius: $base;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      
      position: fixed;
      top: 0;
      right: 0;
      z-index: 4000;
      width: calc(90vw);
      max-width: 420px;
      height: 100lvh;
      overflow-y: auto;

      transition: transform 0.333s;
      transform: translateX(100%);
    }
  }
</style>