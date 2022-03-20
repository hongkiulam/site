<script lang="ts">
	import { navigating } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	import Loader from '$lib/components/Loader.svelte';
</script>

<div>
	<Nav />
	{#if !!$navigating}
		<div class="loader-container"><Loader /></div>
	{/if}
	<main class:navigating={!!$navigating}>
		<slot />
	</main>
</div>

<style>
	div {
		padding: 0 var(--space-xxl);
	}
	main {
		padding: var(--space-xxl) 0;
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
