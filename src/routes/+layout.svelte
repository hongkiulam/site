<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import setProperViewheight from '$lib/utils/set-proper-vh';
  import { onMount } from 'svelte';

  onMount(() => {
    setProperViewheight();
  });
</script>

<div>
  <Nav />
  <main>
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
</style>
