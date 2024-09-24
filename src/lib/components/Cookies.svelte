<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  let visible = false

  onMount(() => {
    visible = !!!localStorage.getItem('closed') ? true : false
  })
</script>

{#if visible}
<dialog class="flex flex--gapped" open transition:fly={{ opacity: 1, y: '100%' }}>
  <h6 class="col col--2of12 col--mobile--12of12">Nous utilisons des témoins de navigation</h6>
  <p class="col col--6of12 col--mobile--12of12">Pour offrir les meilleures expériences, nous utilisons des technologies telles que les cookies pour stocker et/ou accéder aux informations des appareils. Le fait de ne pas consentir ou de retirer son consentement peut avoir un effet négatif sur certaines caractéristiques et fonctions.</p>
  <form class="col col--4of12 col--mobile--12of12 flex flex--gapped flex--bottom flex--center" method="dialog" on:submit={() => {
    visible = false
  }}>
    <button on:click={() => {
      localStorage.setItem('closed', 'true')
    }}>Accepter tout</button>
    <button on:click={() => {
      localStorage.setItem('closed', 'true')
    }}>Refuser</button>
  </form>
</dialog>
{/if}

<style lang="scss">
  dialog {
    position: fixed;
    z-index: 20;
    bottom: 0;
    left: $gap * 2;
    right: $gap * 2;
    width: calc(100% - ($gap * 4));
    padding: $gap ($gap * 2);
    border: none;

    color: var(--foreground);
    background-color: var(--alt-background);
    border-top-left-radius: $gap;
    border-top-right-radius: $gap;

    h6,
    p {
      font-size: $base - 2px;
    }

    form {
      button {
        font-size: $base - 2px;
        flex: 1;
        max-width: 180px;
      }
    }

    @media (max-width: $mobile) {
      left: $mobile_gap;
      right: $mobile_gap;
      width: calc(100% - ($mobile_gap * 2));
      padding: $gap $gap ($gap * 2);

      p {
        margin: $mobile_gap 0;
      }

      form {
        button {
          flex: 1;
        }
      }
    }
  }
</style>