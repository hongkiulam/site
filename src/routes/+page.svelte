<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	// import Room from '$lib/components/3d/Room.svelte';
	// import Me from '$lib/components/Me.svelte';
	import Loader from '$lib/components/shared/Loader.svelte';
	import LandingScene from '$lib/components/3d/LandingScene.svelte';
	let fakeLoading = true;

	let touchDevice = typeof window !== 'undefined' ? 'ontouchstart' in window : false;

	let objectClickHref = '';
</script>

<svelte:head>
	<title>home | haydon lam</title>
</svelte:head>

{#if fakeLoading}
	<div class="loading-container">
		<Loader />
	</div>
{/if}
<div class="canvas-container" class:hidden={fakeLoading} out:fade={{ duration: 0.1 }}>
	<LandingScene
		on:splinedataloaded={() => {
			// after spline data loaded, give some buffer time for canvas to render to page
			setTimeout(() => {
				fakeLoading = false;
			}, 300);
		}}
		on:object-hover={(e) => {
			objectClickHref = e.detail;
		}}
	/>
</div>
{#if objectClickHref}
	<a transition:fade class="object-click-href" href={objectClickHref}
		>Click to go to {objectClickHref}</a
	>
{/if}
{#if !fakeLoading}
	<div class="spline-controls" transition:fade>
		<div class="orbit">
			{#if touchDevice}
				<!-- mobile icon -->
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="6" cy="12" r="3.5" stroke="currentColor" stroke-width="2" />
					<path
						d="M12 12L21 12"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{:else}
				<!-- desktop icon -->
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15V9Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M12 11V6C9 6 9 9.33333 9 11H12Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}

			orbit
		</div>
		<div class="pan">
			{#if touchDevice}
				<!-- mobile icon -->
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="6" cy="8" r="3.5" stroke="currentColor" stroke-width="2" />
					<path
						d="M12 8L17 8"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<circle cx="10" cy="16" r="3.5" stroke="currentColor" stroke-width="2" />
					<path
						d="M16 16L21 16"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{:else}
				<!-- desktop icon -->
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15V9Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M12 11V6C15 6 15 9.33333 15 11H12Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}

			pan
		</div>
	</div>
{/if}

<style>
	.loading-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
	}
	.canvas-container {
		transition: transform 0.3s ease;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		/* so that it sits below navbar */
		z-index: -1;
	}
	.hidden {
		opacity: 0;
		pointer-events: none;
		transform: scale(0);
	}

	.spline-controls {
		position: fixed;
		bottom: var(--spacing-4);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--spacing-2);
	}

	.orbit,
	.pan {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-0);
	}
	.object-click-href {
		display: block;
		background-color: var(--color-bg-1);
		padding: var(--spacing-1) var(--spacing-2);
		position: fixed;
		bottom: var(--spacing-1);
		left: var(--spacing-1);
		border: 1px solid var(--color-copy-1);
		border-radius: var(--border-radius-s);
	}
</style>
