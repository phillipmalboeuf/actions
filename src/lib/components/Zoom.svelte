<script lang="ts">
  import type { LeafletEvent, LeafletEventHandlerFn, Map } from 'leaflet'
  import { onMount } from 'svelte'
  import "leaflet/dist/leaflet.css"
  

  export let file: {
    url: string
    width: number
    height: number
  }

  let element: HTMLElement
  let map: Map
  let dragging = false

  let bounds: {
    top: number
    left: number
    width: number
    height: number
  }

  const maxZoom = 3
  const tileSize = Math.round(file.width / 24)

  const update: LeafletEventHandlerFn = (e) => {
    // console.log((e.target as Map).getBounds())
    // console.log('update')
    // console.log(JSON.stringify((e.target as Map).getBounds(), null, 2))

    const b = (e.target as Map).getBounds()
    bounds = {
      top: (-b.getNorth()) / file.height * 100,
      left: (b.getWest()) / file.width * 100,
      height: (b.getNorth() - b.getSouth()) / file.height * 100,
      width: (b.getEast() - b.getWest()) / file.width * 100,
    }

    // console.log(bounds)
  }

  onMount(async () => {
    const Leaflet = await import('leaflet')
    map = Leaflet.map(element, {
      crs: Leaflet.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.5
    })

    const Zoom = Leaflet.TileLayer.extend({
      getTileUrl: function({ x, y, z }) {
        // console.log({ x, y, z, w: file.width, h: file.height })
        const zoom = Math.round(tileSize / Math.pow(2, z))
        // console.log(`${zoom},${zoom},${x * zoom},${y * zoom}`)
        // if (x < 0 || y < 0) return;
        return `https://gloomy.b-cdn.net/${file.url}?crop=${zoom},${zoom},${x * zoom},${y * zoom}`
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
      noWrap: true
    }).addTo(map)

    map.setView([-file.height / 2, file.width / 2], -2)

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

  <aside
      on:pointermove={(e) => {
        if (dragging) {
          map.panTo({ lng: (e.offsetX / e.target.offsetWidth) * file.width, lat: (e.offsetY / e.target.offsetHeight) * -file.height })
        }
      }}>
    <figure class:dragging on:pointerdown={() => dragging = true}>
      {#if bounds}<button style="top: {bounds.top}%; left: {bounds.left}%; height: {bounds.height}%; width: {bounds.width}%"></button>{/if}
      <img src="https://gloomy.b-cdn.net/{file.url}?width={200}" alt="Controls" draggable="false" />
    </figure>
  </aside>
</main>

<style lang="scss">
  main {
    display: flex;
    align-items: flex-start;

    > figure {
      height: 88vh;
      width: 50%;
      background-color: transparent !important;

      :global(img) {
        object-fit: cover;

        &:after {
          content: attr(src);
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      :global(.leaflet-pane),
      :global(.leaflet-tile-container),
      :global(.leaflet-tile) {
        will-change: transform;
      }
    }

    aside {
      width: 50%;
      display: flex;
      justify-content: center;

      figure {
        cursor: grab;
        position: relative;

        &.dragging {
          cursor: grabbing;
        }

        button {
          position: absolute;
          z-index: 2;
          padding: 0;
          border: 2px solid black;
          border-radius: 2px;
          background: fade-out($color: #000000, $amount: 0.5);
          pointer-events: none;
        }

        img {
        }
      }
    }
  }
  
</style>