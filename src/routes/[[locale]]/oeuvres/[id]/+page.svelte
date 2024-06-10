<script lang="ts">
  import { fade } from 'svelte/transition'
  import Media from '$lib/components/Media.svelte'
  import Document from '$lib/components/document/index.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import Video from '$lib/components/Video.svelte'
  import ZoomPage from './zoom/+page.svelte'
  import Slider from '$lib/components/Slider.svelte'
  import Credit from '$lib/components/Credit.svelte'

  import { imigx, year } from '$lib/formatters'
  import { openDialog } from '$lib/helpers'
  import { pushState } from '$app/navigation'

  import { page } from '$app/stores'

  import type { PageData } from './$types' 
  export let data: PageData

  // export let retour = false
  let img: HTMLElement
  let active: number
</script>

<section style:--color={data.oeuvre.fields.couleur} class="flex flex--gapped">
  <header class="flex flex--gapped">
    <!-- {#if !retour}
    <a href="/">Retour</a>
    {:else}
    <span></span>
    {/if} -->
    <div class="col col--6of12"></div>
    <h1 class="col col--5of12 col--mobile--12of12">{data.oeuvre.fields.annee}</h1>
  </header>

  <figure class="col col--6of12 col--mobile--12of12">
    {#if data.oeuvre.fields.media?.length > 1}
    <Slider autoplay={false} autoheight={false} buttons={false} dots={data.oeuvre.fields.media.length} slidesPerView={1} bind:active>
      <ol class="slider__container">
        {#each data.oeuvre.fields.media as media, i}
        <li class="slide"><Media {media} eager={i === 0} /></li>
        {/each}
      </ol>
    </Slider>
    {:else}
    <Media media={data.oeuvre.fields.vignette} eager bind:img />
    {/if}

    <figcaption style="margin-left: {img?.offsetLeft}px; margin-right: {img?.offsetLeft}px;">
      <small>
        Musée d’art de Joliette<br />
        © Anne Kahane
      </small>
      <a href="/oeuvres/{data.oeuvre.fields.id}/zoom{active !== undefined ? `?i=${active}` : ''}" on:click={openDialog}><Icon i="view" label="Zoom" /></a>
      <a href="{imigx(active !== undefined ? data.oeuvre.fields.media[active].fields.file.url : data.oeuvre.fields.vignette.fields.file.url)}?q=100&w=1020&txt={encodeURIComponent([data.oeuvre.fields.artiste.fields.nom, data.oeuvre.fields.titre, data.oeuvre.fields.anneeDeRealisation || data.oeuvre.fields.annee, data.oeuvre.fields.medium].join(' – '))}&txt-clip=end,ellipsis&txt-align=bottom,right&txt-size=20&txt-color=57221E&h=1320&fit=fill&fill=solid&pad=80&fill-color=FAF8EF&bg=FAF8EF&fm=jpg&dl={data.oeuvre.fields.annee}-{data.oeuvre.fields.titre.replaceAll(' ', '-')}.png" download="{data.oeuvre.fields.annee}-{data.oeuvre.fields.titre.replaceAll(' ', '-')}.png" target="_blank" rel="external"><Icon i="download" label="Téléchargement" /></a>
    </figcaption>
  </figure>
  <main class="col col--5of12 col--mobile--12of12">
    {#if data.oeuvre.fields.description}<h5>{data.oeuvre.fields.description}</h5>{/if}
    <aside>
      <Credit oeuvre={data.oeuvre} />
    </aside>

    {#if data.oeuvre.fields.corps?.content?.length}
    <Document body={data.oeuvre.fields.corps} />
    {:else}
    <p>Met volo omnia non re pa qui to qui sum imi, quae pam sinum quaes rosa atur, omnimus, tota nobit omnihicabor ade expli quodito, nietar laut qui veris velligent eserfer chitio et estinisas pro officidam aut nauate rosarehenient quibero teta idem quides maios enihil is dolut auter incti disaresse ipiendendi bea quam sum rerrovid unt dolup accullorem quete marissim int optatiunt faccabo rosam ribusaperunti ut aut aditaturest incto blabo. Nullescar iusciis erchitatquia nonsequunti velignis nesti ventas ros. Ehenist officimaxim rerora isis adistionet prem. Ximus etter expliques lantore, intiust rosa quassirem doloribus, consequam ut entem niendaepe sam num dis accumo incien ipiset veli totae sim voloribar usamet automa ipisim oribusarer commoler nduciisas nauta sinullab iure moditissir rosas issim.</p>
    <p>Met volo omnia non re pa qui to qui sum imi, quae pam sinum quaes rosa atur, omnimus, tota nobit omnihicabor ade expli quodito, nietar laut qui veris velligent eserfer chitio et estinisas pro officidam aut nauate rosarehenient quibero teta idem quides maios enihil is dolut auter incti disaresse ipiendendi bea quam sum rerrovid unt dolup accullorem quete marissim int optatiunt faccabo rosam ribusaperunti ut aut aditaturest incto blabo. Nullescar iusciis erchitatquia nonsequunti velignis nesti ventas ros. Ehenist officimaxim rerora isis adistionet prem. Ximus etter expliques lantore, intiust rosa quassirem doloribus, consequam ut entem niendaepe sam num dis accumo incien ipiset veli totae sim voloribar usamet automa ipisim oribusarer commoler nduciisas nauta sinullab iure moditissir rosas issim.</p>
    {/if}

    <h3>Détails techniques de l’œuvre</h3>
    <table>
      <tr>
        <td colspan="2">
          <h6>Nom de l’artiste</h6>
          <div>{data.oeuvre.fields.artiste.fields.nom}</div>
          {#if data.oeuvre.fields.artiste.fields.description}<small>{data.oeuvre.fields.artiste.fields.description}</small>{/if}
          <small>{data.oeuvre.fields.artiste.fields.lieuDeNaissance}, {data.oeuvre.fields.artiste.fields.anneeDeNaissance} {#if data.oeuvre.fields.artiste.fields.lieuDeDeces}– {data.oeuvre.fields.artiste.fields.lieuDeDeces}, {data.oeuvre.fields.artiste.fields.anneDeDeces}{/if}</small>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h6>Titre de l’œuvre</h6>
          {data.oeuvre.fields.titre}
        </td>
      </tr>
      <tr>
        <td>
          <h6>Année de réalisation</h6>
          {data.oeuvre.fields.anneeDeRealisation || data.oeuvre.fields.annee}
        </td>
        <td>
          <h6>Médium</h6>
          {data.oeuvre.fields.medium}
        </td>
      </tr>
      <tr>
        <td>
          <h6>Dimensions</h6>
          {#if data.oeuvre.fields.dimensions}{data.oeuvre.fields.dimensions}{:else}{data.oeuvre.fields.largeur} x {data.oeuvre.fields.hauteur} cm{/if}
        </td>
        <td>
          <h6>Numéro d’accession</h6>
          {data.oeuvre.fields.numero}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h6>Mention du donateur</h6>
          {data.oeuvre.fields.mention}
        </td>
      </tr>
    </table>
  </main>
</section>


<style lang="scss">
  section {
    padding: ($gap * 2) ($gap * 2);
    min-height: 100vh;
    background-color: $beige;
    // justify-content: space-around;

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
      }

      > a {
        padding: $base;
      }

      h1 {
        font-size: $base * 10;
        letter-spacing: -0.01em;
        // text-align: center;
        // margin-left: ($gap * 2);
        margin: ($gap * -1.666) auto 0;
      }
    }

    main {
      display: flex;
      flex-direction: column;
      gap: $gap * 1.5;
      margin: auto;

      @media (min-width: $mobile) {
        margin-top: ($gap * 10);
      }

      h5 {
        font-size: ($base * $scale) + 2px;
      }

      h5,
      aside {
        max-width: 400px;
      }

      aside {
        line-height: 1.3;
        margin-bottom: $gap * 2;

        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      :global(p) {
        font-size: $base + 2px;
      }

      :global(figure figcaption) {
        margin-top: $base * 0.5;
        line-height: 1.3;
      }

      h3 {
        margin-top: $gap * 2;
      }

      table {

        h6,
        div {
          margin-bottom: $base * 0.33;
        }

        small {
          font-size: $base - 2px;
        }
      }
    }

    figure {
      align-self: flex-start;
      position: sticky;
      top: 50%;
      transform: translateY(-50%);

      @media (max-width: $mobile) {
        position: static;
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
      }

      figcaption {
        display: flex;
        gap: $base;
        margin-top: $base;

        a:first-of-type {
          margin-left: auto;
        }
      }
    }
  }

</style>