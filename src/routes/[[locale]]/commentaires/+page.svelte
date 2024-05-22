<script lang="ts">
  import { enhance } from '$app/forms'

  let submitting = false
</script>

<form class="flex flex--gapped flex--middle" action="/commentaires" method="post" on:submit={e => {
  if (!submitting) {
    e.preventDefault()
    submitting = true
  } else {
    e.preventDefault()
    submitting = false
  }
}}>
  <input type="text" name="nom" autocomplete="name" placeholder="Inscrire votre nom">
  <input type="email" name="email" autocomplete="email" placeholder="Inscrire votre courriel">
  <textarea name="message" autocomplete="off" placeholder="Rédiger votre message"></textarea>
  <button class:submitting class="button--inverse" type="submit">{#if submitting}Annuler{:else}Envoyer{/if}</button>
  <small>L’Internet est un forum public et l’information électronique peut etre interceptée. Pour des raisons de sécurité et de respect de la vie privée, nous vous demandons de ne pas nous faire parvenir de renseignements personnels ou confidentiels, tels votre numéro d’assurance sociale, l’adresse de votre domicile ou de votre bureau.</small>
</form>

<style lang="scss">
  @property --radius {
    syntax: '<number>';
    inherits: false;
    initial-value: 0;
  }

  form {
    padding: ($base * 1.25) $base;
    max-width: 620px;

    :global(.-commentaires) & {
      padding: ($base * 6) ($base * 2);
      margin: auto;
    }

    input,
    textarea {
      border: 1.5px solid;
      background-color: transparent;

      &:not(:placeholder-shown) {
        color: $brown;
        background-color: $white;
        border-color: transparent;
      }
    }

    small {
      flex: 1;
      margin-left: $gap;
    }

    button[type=submit] {
      text-transform: lowercase;
      width: $base * 5;
      height: $base * 5;
      padding: 0;
      border-radius: 50%;

      transition: --radius 0s;
      --radius: 0;

      color: $yellow;
      border-color: transparent;
      background-origin: border-box;
      background-clip: content-box, border-box;

      &.submitting {
        color: $brown;
        background-image: linear-gradient(white, white), 
          conic-gradient(from 0deg, $brown 0% calc(var(--radius) * 1%), #ffffff calc(var(--radius) * 1%) 100%);
        
        --radius: 100;
        transition: --radius 3s;
      }
    }
  }
</style>