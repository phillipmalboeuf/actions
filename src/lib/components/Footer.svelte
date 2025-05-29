<script lang="ts">
  import type { TypeNavigationSkeleton } from '$lib/clients/content_types'
  import type { Entry } from 'contentful'
  import { languageTag } from '$lib/paraglide/runtime'
  import Icon from './Icon.svelte'
  import Logo from './Logo.svelte'
  
  export let footer: Entry<TypeNavigationSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">

  let form: HTMLFormElement;
  let isSubmitting = false;
  let isSuccess = false;
  let error: string | null = null;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!form) return;

    isSubmitting = true;
    error = null;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Mailchimp
      });

      console.log(response);

      // Since we're using no-cors, we can't check the response status
      // Mailchimp will redirect to a success page if everything is ok
      isSuccess = true;
      form.reset();
    } catch (err) {
      error = languageTag() === "en" 
        ? "An error occurred. Please try again." 
        : "Une erreur est survenue. Veuillez réessayer.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<footer class="flex flex--gapped flex--spaced">
  <figure class="col col--3of12 col--mobile--12of12"><a href="/"><Logo label="Accueil – Actions collectives. Regards féministes sur la collection." /></a></figure>

  <div class="col col--9of12 col--tablet--8of12 col--mobile--12of12">
    <ul class="list--nostyle flex flex--gapped" aria-label="Liens de navigation">
      {#if footer}
      {#each footer.fields.liens as lien, i}
      {#if i < footer.fields.liens.length - 1}
      <li>
        <a href="{lien.fields.route}">{lien.fields.titre}</a>

        {#if lien.fields.sousLiens}
        <ul aria-label="Sous-liens {lien.fields.titre}">
          {#each lien.fields.sousLiens as souslien}
          <li>
            <a href="{souslien.fields.route}">{souslien.fields.titre}</a>
          </li>
          {/each}
        </ul>
        {/if}
      </li>
      {/if}
      {/each}
      {/if}

      <li aria-hidden="true" class="col col--landscape--12of12"></li>

      <li><a href="https://www.museejoliette.org/fr/" target="_blank" rel="external"><Icon i="maj" label="Lien vers le Musée d'art de Joliette" /></a></li>
      <li><a href="https://www.museesnumeriques.ca" target="_blank" rel="external"><Icon i="mnc" label="Lien vers le Musées numériques Canada" /></a></li>
    </ul>
    <div class="flex flex--gapped flex--bottom">
      <form 
        bind:this={form}
        action="https://museejoliette.us7.list-manage.com/subscribe/post?locale=fr" 
        method="post" 
        target="_blank"
        class:is-submitting={isSubmitting}
        class:is-success={isSuccess}
        class:has-error={!!error}
        on:submit={handleSubmit}
      >
        <input type="hidden" name="u" value="0e4b3fa9c3ebd26a49760574a">
        <input type="hidden" name="id" value="8529eaf024">
        <strong>{@html languageTag() === "en" ? 'Newsletter' : 'Infolettre'}&nbsp;MAJ</strong>
        
        {#if isSuccess}
          <div class="success-message" role="alert">
            {languageTag() === "en" 
              ? "Thank you for subscribing!" 
              : "Merci pour votre inscription !"}
          </div>
        {:else}
          <input 
            type="text" 
            name="MERGE1" 
            autocomplete="name" 
            placeholder={languageTag() === "en" ? "Name" : "Nom"}
            aria-label={languageTag() === "en" ? "Name" : "Nom"}
            title={languageTag() === "en" ? "Name" : "Nom"}
            disabled={isSubmitting}
            required
          >
          <input 
            type="email" 
            name="MERGE0" 
            autocomplete="email" 
            placeholder={languageTag() === "en" ? "Email" : "Courriel"}
            aria-label={languageTag() === "en" ? "Email" : "Courriel"}
            title={languageTag() === "en" ? "Email" : "Courriel"}
            disabled={isSubmitting}
            required
          >
          <button 
            class="button--inverse" 
            type="submit" 
            aria-label="Soumettre"
            disabled={isSubmitting}
          >
            <svg width="22" height="22" viewBox="0 0 30 30">
              <path d="M16.582 0C16.5822 3.37758 17.7411 6.65286 19.8652 9.27892C21.9893 11.905 24.9501 13.7229 28.253 14.429V15.073C24.9504 15.7791 21.9899 17.5967 19.8659 20.2223C17.7418 22.848 16.5827 26.1228 16.582 29.5" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10"/>
              <path d="M28.547 14.751H0" stroke="currentColor" stroke-width="1.75"/>
            </svg>
          </button>
          {#if error}
            <div class="error-message" role="alert">{error}</div>
          {/if}
        {/if}
      </form>
      
      <small><a href="{footer.fields.liens[footer.fields.liens.length - 1].fields.route}">{footer.fields.liens[footer.fields.liens.length - 1].fields.titre}</a></small>
      <small>©{new Date().getFullYear()} Musée d'art de Joliette</small>
    </div>
  </div>
</footer>

<style lang="scss">
  footer {
    position: -webkit-sticky;
    position: sticky;
    z-index: 0;
    bottom: 0;
    // color: var(--foreground-inverse);
    font-size: $base - 2px;
    background-color: var(--alt-background);
    padding: ($gap * 2) ($gap * 2) ($gap * 2);
    backface-visibility: hidden;
    overflow-x: hidden;

    @media (max-width: $tablet_landscape) {
      align-items: center;

      li:has(> a[target="_blank"]) {
        margin-bottom: ($mobile_gap * 2);

        &:nth-last-child(2) {
          margin-left: auto;
        }
      }
    }

    @media (max-width: $mobile) {
      gap: ($mobile_gap * 3);
      padding: ($mobile_gap * 2) ($mobile_gap) ($mobile_gap * 2);
    }

    :global(.-pages-credits) ~ &,
    :global(.-pages-bibliographie) ~ &,
    :global(.-en-pages-bibliographie) ~ &,
    :global(.-en-pages-credits) ~ & {
      --alt-background: #{$beige};
      background-color: var(--alt-background);
    }

    div:not(.flex--bottom) {
      display: flex;
      flex-direction: column;
    }

    ul {
      list-style: none;
      justify-content: space-between;
      padding: 0;

      li {
        // flex: 1;

        ul {
          margin-top: $gap * 1.5;

          li {
            margin: ($base * 0.5) 0;
          }
        }
      }

      @media (max-width: $tablet_portrait) {
        display: none;
      }
    }

    figure {
      :global(svg) {
        width: 240px;
        height: 240px;
      }
    }

    .flex--bottom {
      margin-top: auto;
      justify-content: flex-end;
      // gap: $gap * 2;

      small {
        text-align: right;

        @media (max-width: $tablet_portrait) {
          text-align: center;
          width: 100%;

          &:not(:last-of-type) {
            display: none;
          }
        }
      }

      form {
        display: flex;
        align-items: center;
        width: 50%;
        margin-right: auto;

        @media (max-width: $tablet_portrait) {
          flex-wrap: wrap;
          width: 100%;
          row-gap: $mobile_gap;
        }

        strong {
          margin-right: $base;

          @media (max-width: $tablet_portrait) {
            margin: 0 auto;
          }
        }

        input {
          background-color: transparent;
          border: 1.5px solid;
          padding: $base * 0.666;
          border-radius: $base * 1.25;

          &[type="text"] {

            @media (min-width: $tablet_portrait) {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              border-right: none;
            }

            @media (max-width: $tablet_portrait) {
              width: 100%;
            }
          }

          &[type="email"] {
            @media (min-width: $tablet_portrait) {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
              padding-right: $base * 2.5;
            }
          }

          &:not(:placeholder-shown) {
            color: $brown;
            background-color: $white;
            border-color: transparent;
          }
        }

        button {
          display: flex;
          padding: $base * 0.6;
          // height: $base;
          // width: $base;
          border-radius: 50%;
          border: none;
          margin-left: $base * -2.5;
          margin-right: $base * -2.5;

          svg {
            path {
              fill: none;
              stroke: var(--alt-background);
            }
          }
        }

        &.is-submitting {
          opacity: 0.7;
          pointer-events: none;
        }

        &.has-error {
          .error-message {
          }
        }

        .success-message {
          // color: var(--success-color, #059669);
          // text-align: center;
          // padding: $base;
          // background-color: var(--success-bg, rgba(5, 150, 105, 0.1));
          // border-radius: $base * 1.25;
          // margin: $base 0;
        }


        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      }

      @media (max-width: $mobile) {
        justify-content: center;

        a {
          max-width: 35%;
          // &:last-of-type {
          //   margin-left: auto;
          // }

          :global(svg) {
            max-width: 100%;
          }
        }
      }
    }
  }
</style>