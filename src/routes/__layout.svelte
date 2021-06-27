<script lang="ts">
	import { navigating } from '$app/stores';
	import MinusIcon from 'svelte-feather-icons/src/icons/MinusIcon.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<div>
	<Nav />
	{#if !!$navigating}
		<div class="loader"><Icon featherIcon={MinusIcon} size={36} /></div>
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
	.loader {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
		animation: spin 1s infinite;
	}
	@keyframes spin {
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
