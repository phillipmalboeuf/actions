<script lang="ts">
  import type { Entry } from 'contentful'
  import type { TypeOeuvreSkeleton } from '$lib/clients/content_types'
  import type { LeafletEvent, LeafletEventHandlerFn, Map } from 'leaflet'
  import { onMount } from 'svelte'
  import "leaflet/dist/leaflet.css"
  
  import Icon from './Icon.svelte'
  import Credit from './Credit.svelte'
  
  export let oeuvre: Entry<TypeOeuvreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">
  export let file: {
    url: string
    width: number
    height: number
  }

  let element: HTMLElement
  let map: Map
  let dragging = false
  let zoomed = false

  let bounds: {
    top: number
    left: number
    bottom: number
    right: number
    width: number
    height: number
  }

  const maxZoom = 4
  const tileSize = Math.round(Math.min(file.width, file.height) / 24)

  // console.log(file.height / 2, file.width / 2, tileSize)

  const update: LeafletEventHandlerFn = (e) => {
    // console.log(JSON.stringify((e.target as Map).getBounds(), null, 2))

    zoomed = (e.target as Map).getZoom() > -1

    const b = (e.target as Map).getBounds()
    bounds = {
      top: (-b.getNorth()) / file.height * 100,
      left: (b.getWest()) / file.width * 100,
      bottom: (-b.getSouth()) / file.height * 100,
      right: (b.getEast()) / file.width * 100,
      height: (b.getNorth() - b.getSouth()) / file.height * 100,
      width: (b.getEast() - b.getWest()) / file.width * 100,
    }

    // console.log(bounds)
  }

  const reset = () => {
    // console.log(file.width, element.clientWidth, tileSize, Math.sqrt(file.width / element.clientWidth) * -1)
    map.setView([-file.height / 2, file.width / 2], -2)
  }

  onMount(async () => {
    const Leaflet = await import('leaflet')
    map = Leaflet.map(element, {
      crs: Leaflet.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.5,
      zoomAnimation: false,
      fadeAnimation: false
    })

    const Zoom = Leaflet.TileLayer.extend({
      getTileUrl: function({ x, y, z }) {
        // console.log({ x, y, z, w: file.width, h: file.height })
        const zoom = Math.round(tileSize / Math.pow(2, z))
        // console.log(`${file.url}?q=100&auto=forma&rect=${x * zoom},${y * zoom},${zoom},${zoom}&w=${tileSize}&h=${tileSize}`)
        // if (x < 0 || y < 0) return;
        return `${file.url}?q=100&auto=format&rect=${x * zoom},${y * zoom},${zoom},${zoom}&w=${tileSize}&h=${tileSize}`
      },
      getAttribution: function() {
        return "<a href=''>MAJ</a>"
      }
    }) as unknown as typeof Leaflet.TileLayer;

    new Zoom('', {
      maxZoom,
      minZoom: maxZoom * -1,
      tileSize,
      bounds: [[0,0],[-file.height + tileSize, file.width - tileSize]],
      noWrap: true,
    }).addTo(map)

    reset()

    update({ target: map } as LeafletEvent)
    map.on('move', update)
    
    // const layer = Leaflet.tileLayer(`https://gloomy.b-cdn.net/${file.url}?crop=250,250`, {
    //   maxZoom: 10,
    //   minZoom: 1,
    //   // zoomOffset: file.width,
    //   // tileSize: new Leaflet.Point(file.width / 10, file.height / 10),
    //   noWrap: true,
    //   attribution: '&copy; <a href="">MAJ</a>'
    // })

    // layer.addTo(map)
  })  
</script>

<main on:pointerup={() => dragging = false}>
  <figure bind:this={element}></figure>

  <aside>
    <div>
      <figure style="aspect-ratio: {file.width} / {file.height};" class:dragging on:pointerdown={() => dragging = true}
        on:pointermove={(e) => {
          if (dragging) {
            map.panTo({ lng: (e.offsetX / e.currentTarget.offsetWidth) * file.width, lat: (e.offsetY / e.currentTarget.offsetHeight) * -file.height })
          }
        }}>
        {#if bounds}<button style="top: {bounds.top}%; left: {bounds.left}%; height: {bounds.height}%; width: {bounds.width}%"></button>{/if}
        <img src="{file.url}?w={400}&auto=format" alt="Controls" draggable="false" />
        {#if bounds}<img style="clip-path: polygon({bounds.left}% {bounds.top}%, {bounds.left + bounds.width}% {bounds.top}%, {bounds.left + bounds.width}% {bounds.top + bounds.height}%, {bounds.left}% {bounds.top + bounds.height}%);" src="{file.url}?w={400}&auto=format" alt="Zoom area" draggable="false" />{/if}
      </figure>
    

      <nav>
        <button on:click={() => map.zoomIn()}><Icon i="plus" label="Plus zoom" /></button>
        <button on:click={() => map.zoomOut()}><Icon i="minus" label="Minus zoom" /></button>
        <button on:click={reset}>Réinitialiser</button>
      </nav>
    </div>

    <p class:zoomed>
      <Credit {oeuvre} />
    </p>
  </aside>
</main>

<style lang="scss">
  main {
    display: flex;
    gap: $gap * 2;
    // align-items: flex-start;
    justify-content: space-between;

    > figure {
      height: calc(100vh - ($gap * 6));
      width: 100vw;
      background-color: transparent !important;

      

      :global(img.leaflet-tile) {
        object-fit: cover;
        // mix-blend-mode: plus-lighter;
        pointer-events: all;

        // &:after {
        //   content: attr(src);
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        // }
      }

      :global(.leaflet-pane),
      :global(.leaflet-tile-container),
      :global(.leaflet-tile) {
        will-change: transform;
      }
    }

    aside {
      position: absolute;
      z-index: 2000;
      top: $gap * 5;
      bottom: $gap;
      right: $gap;
      display: flex;
      flex-direction: column;
      width: 280px;
      // justify-content: center;

      p {
        margin-top: auto;
        transition: opacity 666ms;

        &.zoomed {
          opacity: 0;
          pointer-events: none;
        }
      }

      div {
        padding: $base * 0.5;
        background-color: $black;
        border-radius: $base * 0.5;
      }

      figure {
        cursor: grab;
        position: relative;
        

        &.dragging {
          cursor: grabbing;
        }

        > button {
          position: absolute;
          z-index: 2;
          padding: 0;
          border: none;
          border-radius: $base * 0.5;
          background: transparent;
          pointer-events: none;
        }

        img {
          display: block;
          width: calc(280px - ($base * 1));

          &:nth-last-child(2) {
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5;
          }

          &:last-child {
            // clip-path: inset(10px 20px 30px 40px);
          }
        }
      }
    }

    nav {
      position: relative;
      z-index: 3;
      display: flex;
      gap: $base;
      margin-top: $base;

      button {
        font-size: 0.88em;
        color: currentColor;
        background-color: transparent;
        padding: 0;
        border: none;

        &:last-child {
          margin-left: auto;
        }
      }
    }
  }
  
</style>