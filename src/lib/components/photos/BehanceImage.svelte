<script lang="ts">
	import type { InternalBehanceProject } from '$types/behance';
	import Loader from '../shared/Loader.svelte';
	export let behanceImage: InternalBehanceProject['images'][number];
	const possibleSizes = [600, 1200, 1400, 1920, 2800];

	const srcset = possibleSizes
		.map((size) => (behanceImage[size] ? `${behanceImage[size].srcset} ${size}w` : ''))
		.filter((x) => !!x)
		.join(', ');
	const sizes = possibleSizes
		.map((size) => (behanceImage[size] ? `${behanceImage[size].media_query} ${size}px` : ''))
		.filter((x) => !!x)
		.join(', ');

	let showInLightbox = false;
	let realImageLoading = false;
	let imageLoadingLock = false;
	/** Will always load for a minimum amount of time artificially */
	$: artificalImageLoading = realImageLoading || imageLoadingLock;
	const minimumImageLoadingTime = 500; //ms
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape' && showInLightbox) {
			showInLightbox = false;
		}
	}}
/>
{#if showInLightbox}
	<div class="backdrop" />
{/if}

<div
	class="lightbox"
	class:open={showInLightbox}
	on:click={() => {
		showInLightbox = false;
	}}
>
	<img
		srcset={showInLightbox ? srcset : undefined}
		sizes={showInLightbox ? sizes : undefined}
		src={behanceImage[600].srcset}
		style="width:{behanceImage[600].width}; height:{behanceImage[600].height}"
		alt=""
		loading="lazy"
		class:lightbox-open={showInLightbox}
		class:loading={artificalImageLoading}
		on:click|stopPropagation={() => {
			// trigger loading stuff when we are about to show in lightbox
			if (!showInLightbox) {
				realImageLoading = true;
				imageLoadingLock = true;
				setTimeout(() => {
					imageLoadingLock = false;
				}, minimumImageLoadingTime);
			}
			showInLightbox = !showInLightbox;
		}}
		on:load={() => {
			if (showInLightbox) {
				realImageLoading = false;
			}
		}}
	/>
	{#if showInLightbox && artificalImageLoading}
		<div class="loader">
			<Loader />
		</div>
	{/if}
</div>

<style>
	img {
		width: 100%;
		cursor: pointer;
	}
	img.lightbox-open {
		width: auto;
		max-width: min(2500px, 85vw);
		margin: 0 auto;
		grid-column: 1/2;
		grid-row: 1/2;
	}
	img.loading {
		visibility: hidden;
		height: 1px;
	}
	img:not(.loading) {
		animation: image-fade 0.3s ease forwards;
	}
	@keyframes image-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--color-bg-2);
		opacity: var(--opacity-85);
		width: 100vw;
		height: 100vh;
		z-index: 1;
	}
	.lightbox {
		/* fixes funny div additional spacing behaviour */
		display: grid;
		place-items: center;
	}
	/* important to override style attribute set by macy */
	.lightbox.open {
		position: fixed !important;
		top: 50% !important;
		transform: translateY(-50%);
		left: 0 !important;
		z-index: 2;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		justify-content: center;
		height: 100vh;
		width: 100vw !important;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.loader {
		grid-column: 1/2;
		grid-row: 1/2;
		z-index: -1;
	}
</style>
