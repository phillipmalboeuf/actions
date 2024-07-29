<script lang="ts">
  import type { Asset } from 'contentful'
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte';


  export let audio: Asset<"WITHOUT_UNRESOLVABLE_LINKS">

  let time = 0
	let duration: number
	let paused: boolean = true
  let volume = 1

  function format(t: number) {
    return Math.floor(t / 60) + ":" + ("0" + (t % 60).toFixed()).slice(-2)
  }

  function seek(t: number) {
    time = t
  }

  function togglePaused() {
    paused = !paused
  }

  // function toggleVolume() {
  //   volume = volume ? 0 : 1
  // }

  // function grab(index) {
  //   seek(grabs[index].fields.time)
  // }

  onMount(() => {
  })
</script>

{#if audio?.fields.file.url}
<figure>
  <figcaption class="title">
    {audio.fields.title}
  </figcaption>

  <audio
    title={audio.fields.description}
    src={audio.fields.file.url}
    bind:currentTime={time}
    bind:duration
    bind:paused
    bind:volume
    on:click={togglePaused} />
  
  <figcaption class="controls">
    <button class="button--none" on:click={togglePaused}>{#if paused}<Icon i="play" label="Play" />{:else}Pause{/if}</button>
    <!-- <button on:click={toggleVolume}>{#if volume}Sound Off{:else}Sound On{/if}</button> -->
    
   {#if duration}
    <!-- <label for="time" style="left: {time / duration * 100}%">{format(time)} / {format(duration)}</label> -->
    <label for="time">
      {format(time)}
    </label>
    <input id="time" name="time" type="range" value={time} min={0} step={0.01} max={duration}
      on:input={e => seek(Number(e.currentTarget.value))} />
    <label for="time">
      {format(duration)}
    </label>
    {/if}
  </figcaption>
</figure>
{/if}



<style lang="scss">
  audio {
    width: 100%;
    // object-fit: cover;
  }

  figure {
    width: 100%;
    margin: $gap 0;
    padding: ($gap * 0.75) ($gap * 0.75) ($gap * 0.5);
    border-radius: $base * 0.75;
    background-color: $beige-dark;

    @media (max-width: $mobile) {
      padding: ($mobile_gap * 0.5);
    }
  }

  figcaption.title {
    margin-bottom: $gap * 0.5;
  }

  figcaption.controls {
    // position: absolute;
    // left: 0;
    // bottom: $base * 0.5;
    width: 100%;
    display: flex;
    gap: $gap * 0.5;
    // justify-content: space-between;
    align-items: center;
  }

    label[for="time"] {
      // position: absolute;
      // bottom: $gap * 2.5;
      // font-size: var(--tiny);
      // transform: translateX(-50%);
    }

    input[type="range"] {
      // position: absolute;
      // bottom: $gap * 2;
      // left: 0;
      width: 100%;
      margin: 0;

      cursor: col-resize;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      height: 5px;
      background-color: $grey-ish;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;

      width: $base * 0.75;
      height: $base * 0.75;
      background: $beige-dark;
      border: 1px solid $brown;
      border-radius: 50%;
    }

    input[type="range"]::-moz-range-thumb {
      -moz-appearance: none;

      width: $base * 0.75;
      height: $base * 0.75;
      background: $beige-dark;
      border: 1px solid $brown;
      border-radius: 50%; 
    }
</style>