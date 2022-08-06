<script context="module">
	import { writable } from 'svelte/store';
	export const blockNavigationLoader = writable(false);
</script>

<script lang="ts">
	import { navigating as actuallyNavigating } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	import Loader from '$lib/components/shared/Loader.svelte';

	let artificalNavigating = false;

	$: perceivedNavigating = $actuallyNavigating || artificalNavigating;

	$: if (!$actuallyNavigating) {
		// finished navigating, turn on navigation loader again for
		// next navigation
		$blockNavigationLoader = false;
	}
	$: if (!!$actuallyNavigating && !$blockNavigationLoader) {
		// started navigation, begin artificial loading
		artificalNavigating = true;
		setTimeout(() => {
			artificalNavigating = false;
		}, 300);
	}
</script>

<div>
	<Nav />
	{#if perceivedNavigating && !$blockNavigationLoader}
		<div class="loader-container"><Loader /></div>
	{/if}
	<main class:navigating={perceivedNavigating && !$blockNavigationLoader}>
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
