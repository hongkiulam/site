<script lang="ts">
	import type { InternalBehanceProject } from '$types/behance';
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	export let images: InternalBehanceProject['images'];
	export let imageIndex: number;

	const dispatch = createEventDispatcher();

	let imgEl: HTMLImageElement;
	$: imageSet = images[imageIndex];
	$: hasImage = !!imageSet;
	let imageBindingConstraint: 'x' | 'y' | '' = '';
// TODO add loading spinner, set loading=true when imageIndex is reset to undefined
// set loading false once image has finished loading
	$: checkImageBounds = () => {
		const containerW = window.innerWidth;
		const containerH = window.innerHeight;
		const imageW = imgEl.naturalWidth;
		const imageH = imgEl.naturalHeight;
		const portrait = imageW < imageH;

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
			return (imageBindingConstraint = portrait ? 'y' : 'x');
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
	<div class="lightbox">
		<img
			on:load={checkImageBounds}
			bind:this={imgEl}
			class={imageBindingConstraint}
			srcset="{imageSet[600].srcset} 600w,
		{imageSet[1200].srcset} 1200w,
		{imageSet[1400].srcset} 1400w,
		{imageSet[2800].srcset} 2800w"
			sizes="{imageSet[600].media_query} 600px,
		{imageSet[1200].media_query} 1200px,
		{imageSet[1400].media_query} 1400px,
		{imageSet[2800].media_query} 2800px"
			alt="uh oh"
		/>
	</div>
{/if}

<style>
	.lightbox {
		position: fixed;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		background: var(--bg-1);
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
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
