<script lang="ts">
  import { onMount } from 'svelte'

  // import Gallery from './Gallery.svelte'

  import { page } from '$app/stores'

  // export let poster
  export let srcs

  let time = 0
	let duration: number
  let buffered
	let paused: boolean = true
  let resolution = 0
  let showResolutions = false
  let volume = 0
  let fullscreen = false
  let inactive = false

  let element
  let inactiveTimeout

  function format(t) {
    return Math.floor(t / 60) + ":" + ("0" + (t % 60).toFixed()).slice(-2)
  }

  function seek(t) {
    time = t
  }

  function togglePaused() {
    paused = !paused
    if (paused) {
      clearTimeout(inactiveTimeout)
      inactive = false
    }
  }

  function toggleVolume() {
    volume = volume ? 0 : 1
  }

  function selectResolution(index) {
    resolution = index
  }

  function requestToggleFullscreen() {
    if (!fullscreen) {
      element.webkitRequestFullscreen()
    } else {
      element.webkitCancelFullScreen()
    }
  }

  function toggleFullscreen() {
    fullscreen = !fullscreen
  }

  function scrollPastVideo() {
		window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
	}

  function keydown(e) {
    if (e.key === ' ') {
      e.preventDefault()
      togglePaused()
    }
  }

  function activate() {
    clearTimeout(inactiveTimeout)
    inactiveTimeout = setTimeout(() => inactive = true, 1666)
    inactive = false
  }

  // function grab(index) {
  //   seek(grabs[index].fields.time)
  // }

  onMount(() => {
    document.addEventListener('webkitfullscreenchange', toggleFullscreen, false)

    return () => document.removeEventListener('webkitfullscreenchange', toggleFullscreen)
  })
</script>

<svelte:window on:keydown={keydown} />

<figure class:inactive class:fullscreen on:mousemove={activate} bind:this={element}>
  <figcaption class="title"><slot name="title" /></figcaption>

  <video autoplay disableRemotePlayback
    src={srcs ? srcs[resolution].fields?.file?.url?.replace('//videos.ctfassets.net', '//telescopefilms.b-cdn.net') : undefined}
    bind:currentTime={time}
    bind:duration
    bind:buffered
    bind:paused
    bind:volume
    on:play={activate}
    on:click={togglePaused} />
  
  <figcaption class="controls">
    <button on:click={togglePaused}>{#if paused}Play{:else}Pause{/if}</button>
    <button on:click={toggleVolume}>{#if volume}Sound Off{:else}Sound On{/if}</button>
    
    <!-- <span>
      <span on:mouseenter={() => showResolutions = true} on:mouseleave={() => showResolutions = false}>
        {#if showResolutions}
        {#each srcs as src, index}
        <button class:faded={resolution !== index} on:click={() => selectResolution(index)}>{src.fields.description}</button>   
        {/each}
        {:else}
        <button>{srcs[resolution].fields.description}</button>  
        {/if}
      </span>
      <button on:click={requestToggleFullscreen}>{#if fullscreen}╻{:else}╹{/if}</button>
      
      <button on:click={scrollPastVideo} style="transform: rotate(90deg)">→</button>
    </span> -->
  </figcaption>

  <figcaption class="seeker">
    {#if duration}
    <label for="time" style="left: {time / duration * 100}%">{format(time)} / {format(duration)}</label>
    <input id="time" name="time" type="range" value={time} min={0} step={0.01} max={duration}
      on:input={e => seek(e.currentTarget.value)} />
    {/if}

    <!-- {#if buffered}
    {#each buffered as { start, end }}
    <div class="buffer" style="left: {start / duration * 100}%; width: {(end - start) / duration * 100}%;" />
    {/each}
    {/if} -->
  </figcaption>
</figure>

<!-- {#if grabs}
  <Gallery images={grabs.map(grab => ({ thumbnail: grab.fields.thumbnail }))} on:pick={event => grab(event.detail)} />
{/if} -->



<style lang="scss">
  video {
    width: 100vw;
    height: $vh;
    background: $black;
    // object-fit: cover;
  }

  figure {
    position: relative;
    z-index: 2000;

    color: white;
    cursor: default;
  }

  figure.inactive {
    cursor: none;
  }

  figure.fullscreen video {
    height: var(--height);
  }

  figcaption {
    transition: opacity 666ms;
    opacity: 1;
  }

  figure.inactive figcaption {
    opacity: 0;
  }

  figcaption.title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    padding: $base;
    // text-align: center;
  }

  /* figure.fullscreen figcaption.title {
    top: calc(var(--gutter));
    left: calc(var(--gutter));
  }

  @media (max-width: 900px) {
    figure.fullscreen figcaption.title {
      left: calc(var(--gutter) / 2);
    }
  } */

  figcaption.controls {
    position: absolute;
    left: 0;
    bottom: $base * 0.5;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

    button {
      color: $white;
      background-color: transparent;
    }

    button.faded {
      opacity: 0.666;
    }

    label[for="time"] {
      position: absolute;
      bottom: $gap * 2.5;
      font-size: var(--tiny);
      transform: translateX(-50%);
    }

    figure.fullscreen input[type="range"] {
      bottom: 30px;
    }

    input[type="range"] {
      position: absolute;
      bottom: $gap * 2;
      left: 0;
      width: 100%;
      margin: 0;

      cursor: col-resize;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      height: 2px;
      background-color: $white;
    }

    // figure.fullscreen input[type="range"] {
    //   bottom: 6px;
    // }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;

      width: $base * 0.5;
      height: $base * 0.5;
      background: $white;
      border-radius: 50%;
    }

    input[type="range"]::-moz-range-thumb {
      -moz-appearance: none;

      width: $base * 0.5;
      height: $base * 0.5;
      background: $white;
      border-radius: 50%; 
    }

    // .buffer {
    //   position: absolute;
    //   bottom: 0;

    //   display: block;
    //   height: 12px;
    //   background: white;
    // }

    // figure.fullscreen .buffer {
    //   bottom: -6px;
    // }
</style>