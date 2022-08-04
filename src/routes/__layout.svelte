<script lang="ts">
	import { navigating } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	import Loader from '$lib/components/shared/Loader.svelte';
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
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding-inline: var(--spacing-8);
		padding-block-end: var(--spacing-2);
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
	@media (--breakpoints-sm-max) {
		div {
			padding-inline: var(--spacing-3);
		}
	}
</style>
