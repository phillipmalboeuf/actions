<script lang="ts">
  import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'
  import ZoomPage from './zoom/+page.svelte'
  import Slider from '$lib/components/Slider.svelte'
  import Credit from '$lib/components/Credit.svelte'

  import { imigx, year, intlNumber } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'
  import { pushState } from '$app/navigation'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  import Audio from '$lib/components/Audio.svelte'
  import { languageTag } from '$lib/paraglide/runtime';
  export let data: PageData
  export let dialog = false
  
  let active: number

  let img: HTMLImageElement
  let offset = 0

  $: {
    if (img) {
      offset = img.offsetLeft
    }
  }
</script>

<svelte:head>
	<title>{data.oeuvre.fields.titre} – {data.ligne.fields.titre}</title>
  {#if data.oeuvre.fields.descriptionSearch}
  <meta name="description" content="{data.oeuvre.fields.descriptionSearch}" />
  {/if}
</svelte:head>

<svelte:window on:resize={() => {
  if (img) {
    offset = img.offsetLeft
  }
}} />

{#key data.oeuvre.sys.id}
<section style:--color={data.oeuvre.fields.couleur} class="flex flex--gapped">
  <header class="flex flex--gapped">
    <!-- {#if !retour}
    <a href="/">Retour</a>
    {:else}
    <span></span>
    {/if} -->
    <div class="col col--6of12 col--mobile--12of12"></div>
    <h1 class="col col--5of12 col--mobile--12of12">{data.oeuvre.fields.anneeEvenement}</h1>
    {#if data.oeuvre.fields.description}<h5 class="col col--12of12">{@html data.oeuvre.fields.description}</h5>{/if}
  </header>

  <figure class="col col--6of12 col--mobile--12of12">
    {#if data.oeuvre.fields.media?.length > 1}
    <Slider autoplay={false} autoheight={false} buttons={false} dots={data.oeuvre.fields.media.length} slidesPerView={1} bind:active>
      <ol class="list--nostyle slider__container">
        {#each data.oeuvre.fields.media as media, i}
        <li class="slide"><Media {media} eager={i === 0} /></li>
        {/each}
      </ol>
    </Slider>
    {:else}
    <Media media={data.oeuvre.fields.vignette} eager bind:img />
    {/if}

    {#key img?.complete}
    <figcaption style="margin-left: {offset}px; margin-right: {offset}px;">
      <small>
        {#if data.oeuvre.fields.droits}
        <p>{data.oeuvre.fields.droits}</p>
        {/if}
      </small>
      {#if data.oeuvre.fields.lienVideo}
      <a href="/oeuvres/{data.oeuvre.fields.id}/video" on:click={openDialog} class="play" role="button"><Icon i="play" label="Voir la vidéo" /></a>
      {:else}
      <a href="/oeuvres/{data.oeuvre.fields.id}/zoom{active !== undefined ? `?i=${active}` : ''}" on:click={openDialog} role="button"><Icon i="view" label="Zoom" /></a>
      {#if data.oeuvre.fields.fiche}
      <a href="{data.oeuvre.fields.fiche.fields.file.url}" download target="_blank" rel="external" role="button"><Icon i="download" label="Téléchargement" /></a>
      {/if}
      {/if}
      

      {#if data.oeuvre.fields.audio}
      <Audio audio={data.oeuvre.fields.audio} />
      {/if}
    </figcaption>
    {/key}
  </figure>
  <article class="col col--5of12 col--tablet--6of12 col--mobile--12of12">
    {#if data.oeuvre.fields.description}<h4>{@html data.oeuvre.fields.description}</h4>{/if}
    <aside>
      <Credit oeuvre={data.oeuvre} />
    </aside>

    {#if data.oeuvre.fields.corps?.content?.length}
    <Document body={data.oeuvre.fields.corps} />
    {:else}
    <p>Met volo omnia non re pa qui to qui sum imi, quae pam sinum quaes rosa atur, omnimus, tota nobit omnihicabor ade expli quodito, nietar laut qui veris velligent eserfer chitio et estinisas pro officidam aut nauate rosarehenient quibero teta idem quides maios enihil is dolut auter incti disaresse ipiendendi bea quam sum rerrovid unt dolup accullorem quete marissim int optatiunt faccabo rosam ribusaperunti ut aut aditaturest incto blabo. Nullescar iusciis erchitatquia nonsequunti velignis nesti ventas ros. Ehenist officimaxim rerora isis adistionet prem. Ximus etter expliques lantore, intiust rosa quassirem doloribus, consequam ut entem niendaepe sam num dis accumo incien ipiset veli totae sim voloribar usamet automa ipisim oribusarer commoler nduciisas nauta sinullab iure moditissir rosas issim.</p>
    <p>Met volo omnia non re pa qui to qui sum imi, quae pam sinum quaes rosa atur, omnimus, tota nobit omnihicabor ade expli quodito, nietar laut qui veris velligent eserfer chitio et estinisas pro officidam aut nauate rosarehenient quibero teta idem quides maios enihil is dolut auter incti disaresse ipiendendi bea quam sum rerrovid unt dolup accullorem quete marissim int optatiunt faccabo rosam ribusaperunti ut aut aditaturest incto blabo. Nullescar iusciis erchitatquia nonsequunti velignis nesti ventas ros. Ehenist officimaxim rerora isis adistionet prem. Ximus etter expliques lantore, intiust rosa quassirem doloribus, consequam ut entem niendaepe sam num dis accumo incien ipiset veli totae sim voloribar usamet automa ipisim oribusarer commoler nduciisas nauta sinullab iure moditissir rosas issim.</p>
    {/if}

    {#if data.oeuvre.fields.credits}
    <small class="credits">
      <Document body={data.oeuvre.fields.credits} />
    </small>
    {/if}

    <h4>{@html languageTag() === "en" ? 'Technical details' : 'Détails techniques de l’œuvre'}</h4>
    <table class="small">
      <tbody>
      <tr>
        <td colspan="2">
          <h6>{@html languageTag() === "en" ? 'Artist' : 'Nom de l’artiste'}</h6>
          <p>
            {#if data.oeuvre.fields.artiste}
            {data.oeuvre.fields.artiste.fields.nom}
            {#if data.oeuvre.fields.artiste.fields.description}<small>{@html data.oeuvre.fields.artiste.fields.description}</small>{/if}
            ({data.oeuvre.fields.artiste.fields.lieuDeNaissance}, {data.oeuvre.fields.artiste.fields.anneeDeNaissance}{#if data.oeuvre.fields.artiste.fields.lieuDeDeces}&nbsp;– {data.oeuvre.fields.artiste.fields.lieuDeDeces}, {data.oeuvre.fields.artiste.fields.anneDeDeces}{/if})
            {/if}
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h6>{@html languageTag() === "en" ? 'Title' : 'Titre de l’œuvre'}</h6>
          <em>{@html data.oeuvre.fields.titre}</em>
        </td>
      </tr>
      <tr>
        <td>
          <h6>{@html languageTag() === "en" ? 'Year of production' : 'Année de réalisation'}</h6>
          {data.oeuvre.fields.anneeDeRealisation || data.oeuvre.fields.annee}
        </td>
        <td>
          <h6>{@html languageTag() === "en" ? 'Technique and materials' : 'Médium et support'}</h6>
          {data.oeuvre.fields.medium}
        </td>
      </tr>
      {#if data.oeuvre.fields.dimensions || data.oeuvre.fields.largeur}
      <tr>
        <td colspan="2">
          <h6>{@html languageTag() === "en" ? 'Dimensions' : 'Dimensions'}</h6>
          {#if data.oeuvre.fields.dimensions}{data.oeuvre.fields.dimensions}{:else}{intlNumber(data.oeuvre.fields.largeur)} cm x {intlNumber(data.oeuvre.fields.hauteur)} cm {#if data.oeuvre.fields.profondeur}x {intlNumber(data.oeuvre.fields.profondeur)} cm{/if}{/if}
        </td>
      </tr>
      {/if}
      <tr>
        <td colspan="2">
          <h6>{@html languageTag() === "en" ? 'Source' : 'Mention de source'}</h6>
          {data.oeuvre.fields.mention}
        </td>
      </tr>
      <tr>
        <td>
          <h6>{@html languageTag() === "en" ? 'Accession number' : 'Numéro d’acquisition'}</h6>
          {data.oeuvre.fields.numero}
        </td>
        <td>
          <h6>{@html languageTag() === "en" ? 'Year of acquisition' : 'Année d’entrée au Musée'}</h6>
          {data.oeuvre.fields.anneeDentreeAuMusee || data.oeuvre.fields.numero?.split('.')[0]}
        </td>
      </tr>
      </tbody>
    </table>

    {#if data.oeuvre.fields.extraCredits}
    <div>
    <h6><strong>{@html languageTag() === "en" ? 'Exposed components' : 'Composantes exposées'}</strong></h6>
    <!-- <small> -->
      {#if data.oeuvre.fields.extraCredits}
      <p>{@html data.oeuvre.fields.extraCredits}</p>
      {/if}
    <!-- </small> -->
    </div>
    {/if}

    {#if data.oeuvre.fields.historiqueTxt || data.oeuvre.fields.historique}
    <div>
    <h6><strong>{@html languageTag() === "en" ? 'Exhibition history' : 'Historique d’exposition'}</strong></h6>
    <small>
      {#if data.oeuvre.fields.historique}
      <Document body={data.oeuvre.fields.historique} />
      {:else}
      <p>{@html data.oeuvre.fields.historiqueTxt}</p>
      {/if}
    </small>
    </div>
    {/if}

    {#if data.oeuvre.fields.publicationsTxt || data.oeuvre.fields.publications}
    <div>
    <h6><strong>{@html languageTag() === "en" ? 'Publication history' : 'Historique de publication'}</strong></h6>
    <small>
      {#if data.oeuvre.fields.publications}
      <Document body={data.oeuvre.fields.publications} />
      {:else}
      <p>{@html data.oeuvre.fields.publicationsTxt}</p>
      {/if}
    </small>
    </div>
    {/if}

    <nav>
      {#if data.prev}
      <a href="/oeuvres/{data.prev.fields.id}" class="prev" role="button" on:click={e => $page.state.open && openDialog(e)}>
        <Icon label={languageTag() === "en" ? "Previous work" : "Oeuvre précédente"} i="big-next" />
        <h2>{data.prev.fields.anneeEvenement}</h2>
      </a>
      {:else}
      <span></span>
      {/if}

      {#if data.next}
      <a href="/oeuvres/{data.next.fields.id}" class="next" role="button" on:click={e => $page.state.open && openDialog(e)}>
        <Icon label={languageTag() === "en" ? "Next work" : "Oeuvre suivante"} i="big-next" />
        <h2>{data.next.fields.anneeEvenement}</h2>
      </a>
      {/if}
    </nav>

    {#if !dialog && data.ligne}
    <a class="last" href="/lignes/{data.ligne.fields.id}">
      <Icon i={"back"} label="Retour" /> {languageTag() === "en" ? "Return to the timeline" : "Revenir à la ligne du temps"}
    </a>
    {/if}
  </article>
</section>
{/key}

<style lang="scss">
  section {
    padding: ($gap * 2) ($gap * 2);
    min-height: $vh;
    background-color: $beige;
    // justify-content: space-around;

    @media (max-width: $tablet_portrait) {
      padding: ($gap * 1);
    }

    @media (max-width: $mobile) {
      padding: $mobile_base;
    }

    header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 0 ($gap * 2);

      @media (max-width: $mobile) {
        position: static;
        padding: 0 $mobile_gap;
      }

      // > a {
      //   padding: $base;
      // }

      h1 {
        font-size: $base * 10;
        letter-spacing: -0.01em;
        // text-align: center;
        // margin-left: ($gap * 2);
        margin: ($gap * -1.666) auto 0;

        @media (max-width: $mobile) {
          margin-top: $mobile_gap * 2;
          font-size: $mobile_base * 8;
          text-align: center;
        }
      }

      h5 {
        text-align: center;
        margin-bottom: $mobile_gap;

        @media (min-width: $mobile) {
          display: none;
        }
      }
    }

    article {
      display: flex;
      flex-direction: column;
      gap: $gap * 1.75;
      margin: auto;

      @media (min-width: $mobile) {
        margin-top: ($gap * 10);
      }

      h4,
      aside {
        max-width: 400px;
      }

      div {
        h6 {
          margin-bottom: $base;
        }
      }

      .credits {
        margin-top: $gap * 2;
      }

      aside {
        font-size: $base + 2px;
        line-height: 1.3;
        margin-bottom: $gap * 2;

        display: flex;
        flex-direction: column;
        gap: 4px;

        @media (max-width: $mobile) {
          font-size: $base + 4px;
          margin: ($mobile_gap * 2) 0;
        }
      }

      @media (max-width: $mobile) {
        > :global(p),
        > :global(ul p),
        > :global(ol p),
        > :global(blockquote > p) {
          font-size: $base;
        }
      }

      :global(figure figcaption) {
        margin-top: $base * 0.75;
        line-height: 1.3;
      }

      h4 {
        font-size: $base * 1.444;
        margin-top: $gap * 2;

        @media (max-width: $mobile) {
          font-size: $gap;
          
          &:first-child {
            display: none;
          }
        }
      }

      table {
        margin-bottom: $gap;

        @media (max-width: $mobile) {
          tr {
            display: flex;
            flex-wrap: wrap;
          }
          td {
            width: 100%;
            font-size: $base;
            padding: ($mobile_base * 0.666) 0;
          }
        }

        td + td {
          position: relative;

          &:before {
            content: "";
            position: absolute;
            bottom: -1px;
            left: $gap * -1;
            width: $gap;
            height: 2px;
            background-color: $beige;

            @media (max-width: $mobile) {
              left: $mobile_gap * -1;
              width: $mobile_gap;
            }
          }
        }

        h6,
        div {
          margin-bottom: $base * 0.33;
        }

        small {
          font-size: $base - 2px;
        }
      }

      nav {
        display: flex;
        justify-content: space-between;
        margin: ($gap * 2) 0;

        a {
          display: flex;
          align-items: center;
          gap: $base;

          // :global(svg) {
          //   width: $base * 4;
          // }

          h2 {
            font-size: 70px;

            @media (max-width: $tablet_landscape) {
              font-size: 50px;
            }
          }

          :global(svg) {
            @media (max-width: $tablet_landscape) {
              width: 38.5px;
              height: 36px;
            }
          }

          &.next {
            :global(svg) {
              order: 99;
              transform: rotate(180deg);
            }
          }
        }
      }

      .last {
        padding: $mobile_gap $mobile_gap ($mobile_gap * 2);
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: $mobile_gap * 0.5;

        :global(svg) {
          height: 24px;
          width: 24px;
        }
      }
    }

    figure {
      align-self: flex-start;
      position: sticky;
      top: 50%;
      transform: translateY(-50%);

      @media (max-width: $mobile) {
        position: relative;
        top: 0;
        transform: none;
      }
      
      :global(img),
      :global(video) {
        width: auto;
        max-width: 100%;
        margin: 0 auto;
        max-height: 66vh;
        object-fit: contain;
        background-color: transparent;

        @media (max-width: $mobile) {
          max-height: none;
        }
      }

      figcaption {
        display: flex;
        flex-wrap: wrap;
        gap: $base;
        margin-top: $base;

        a:first-of-type {
          margin-left: auto;
        }

        small {
          max-width: calc(100% - ($gap * 6));
        }

        @media (max-width: $mobile) {
          align-items: center;
          margin: $mobile_base 0 ($mobile_gap) !important;
        }
      }
    }

    .play {
      :global(svg) {
        overflow: visible;
      }
      
      :global(path) {
        fill: none;
        stroke: currentColor;
        stroke-width: 1px;
      }
    }
  }

</style>