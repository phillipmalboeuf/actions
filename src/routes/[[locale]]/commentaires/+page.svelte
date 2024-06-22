<script lang="ts">
  import { invalidateAll, goto } from '$app/navigation'
	import { applyAction, deserialize } from '$app/forms'
	
	import type { ActionData } from './$types'
	import type { ActionResult } from '@sveltejs/kit'
  import { page } from '$app/stores'
  import Icon from '$lib/components/Icon.svelte'
	
	// export let form: ActionData

  let submitting = false
  let ready = false
  let element: HTMLFormElement
  let timeout: NodeJS.Timeout

  let error: any;
	
	async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		const data = new FormData(event.currentTarget)
	
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data,
		})
	
		const result: ActionResult = deserialize(await response.text())
	
		if (result.type === 'success') {
			element.reset()
			await invalidateAll()
		}
	
		applyAction(result)

    submitting = false
    ready = false
	}
</script>

<form class="flex flex--gapped flex--middle" action="/commentaires" method="post" bind:this={element} on:submit|preventDefault={e => {
  if (ready) { return handleSubmit(e) }

  if (!submitting) {
    submitting = true

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      ready = true
      element.requestSubmit()
    }, 3000)
  } else {
    clearTimeout(timeout)
    submitting = false
  }
}}>
  <input type="text" name="nom" autocomplete="name" placeholder="Inscrire votre nom">
  <input type="email" name="email" autocomplete="email" placeholder="Inscrire votre courriel" required>
  <textarea name="message" autocomplete="off" placeholder="Rédiger votre message" required maxlength="10000" on:input={e => {
    if (e.currentTarget.value === '') {
      e.currentTarget.style.height = null
    } else {
      e.currentTarget.style.height = (e.currentTarget.scrollHeight + (3)) + "px"
    }
  }}></textarea>
  <button class:submitting class="button--inverse" type="submit">{#if $page.form?.Message}<Icon label="Réussi" i="check" />{:else}{#if submitting}Annuler{:else}Envoyer{/if}{/if}</button>
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

      &:not(:placeholder-shown),
      &:autofill {
        color: $brown;
        background-color: $white;
        border-color: transparent;
      }

      &:autofill {
        color: $brown !important;
        background-color: $white !important;
        border-color: transparent;
      }
    }

    small {
      flex: 1;
      margin-left: $gap;

      @media (max-width: $mobile) {
        margin-left: $mobile_gap;
        margin-top: $mobile_base;
      }
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