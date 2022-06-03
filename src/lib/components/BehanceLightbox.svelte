<script lang="ts">
	import type { InternalBehanceProject } from '$types/behance';
	import { createEventDispatcher } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';

	export let images: InternalBehanceProject['images'];
	export let imageIndex: number;

	const dispatch = createEventDispatcher();
	const possibleSizes = [600, 1200, 1400, 1920, 2800];

	let imageLoading = false;
	let imageBindingConstraint: 'x' | 'y' | '' = '';
	let imgEl: HTMLImageElement;

	$: imageSet = images[imageIndex];
	$: hasImage = !!imageSet;
	$: loading = imageLoading || !imageBindingConstraint;

	$: imageIndex && (imageBindingConstraint = '');

	$: checkImageBounds = () => {
		const containerW = window.innerWidth;
		const containerH = window.innerHeight;
		const imageW = imgEl?.naturalWidth;
		const imageH = imgEl?.naturalHeight;
		const screenPortrait = containerW < containerH;

		let shouldBindX = false;
		let shouldBindY = false;
		if (imageW > containerW) {
			shouldBindX = true;
		}

		if (imageH > containerH) {
			shouldBindY = true;
		}
		if (!shouldBindX && !shouldBindY) return (imageBindingConstraint = '');
		if (shouldBindX && shouldBindY) {
			return (imageBindingConstraint = screenPortrait ? 'x' : 'y');
		}
		// one of the bindings is true, only need to check for one
		imageBindingConstraint = shouldBindX ? 'x' : 'y';
	};
</script>

<svelte:window
	on:resize={checkImageBounds}
	on:keydown={(e) => {
		if (e.key == 'Escape') {
			if (!hasImage) return;
			// close lightbox
			dispatch('close');
		}
	}}
/>

{#if hasImage}
	<div class="backdrop fullscreen-center-content" />
	<div class="loader fullscreen-center-content">
		<Loader />
	</div>
	<div
		class="lightbox fullscreen-center-content"
		on:click={(e) => {
			if (e.target === imgEl) return;
			dispatch('close');
		}}
	>
		<img
			on:load={checkImageBounds}
			bind:this={imgEl}
			class={imageBindingConstraint}
			class:loading
			srcset={possibleSizes
				.map((size) => (imageSet[size] ? `${imageSet[size].srcset} ${size}w` : ''))
				.filter((x) => !!x)
				.join(', ')}
			sizes={possibleSizes
				.map((size) => (imageSet[size] ? `${imageSet[size].media_query} ${size}px` : ''))
				.filter((x) => !!x)
				.join(', ')}
			alt="uh oh"
		/>
	</div>
{/if}

<style>
	.fullscreen-center-content {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.backdrop {
		background-color: var(--bg-1);
		opacity: 0.5;
		backdrop-filter: blur(100px);
		z-index: 997;
	}
	.loader {
		z-index: 998;
	}
	.lightbox {
		z-index: 999;
	}
	img.x {
		width: 100%;
		height: auto;
	}
	img.y {
		height: 100%;
		width: auto;
	}
</style>
