<script lang="ts">
  import { navigating as actuallyNavigating } from '$app/stores';
  import Nav from '$lib/components/Nav.svelte';
  import Loader from '$lib/components/shared/Loader.svelte';
  import setProperViewheight from '$lib/utils/set-proper-vh';
  import { onMount } from 'svelte';

  let artificalNavigating = false;

  $: perceivedNavigating = $actuallyNavigating || artificalNavigating;

  $: if (!!$actuallyNavigating) {
    // started navigation, begin artificial loading
    artificalNavigating = true;
    setTimeout(() => {
      artificalNavigating = false;
    }, 300);
  }
  onMount(() => {
    setProperViewheight();
  });
</script>

<div>
  <Nav />
  {#if perceivedNavigating}
    <div class="loader-container"><Loader /></div>
  {/if}
  <main class:navigating={perceivedNavigating}>
    <slot />
  </main>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: var(--spacing-8);
    padding-block-end: var(--spacing-2);
  }
  @media (--breakpoints-sm-max) {
    div {
      padding-inline: var(--spacing-3);
    }
  }

  .navigating {
    opacity: 0.1;
    pointer-events: none;
  }
  .loader-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    place-items: center;
  }
</style>
