<script lang="ts">
	import type { InternalBehanceProject } from '$types/behance';

	import BehanceIcon from 'simple-icons/icons/behance.js';
	import AppWindow from './AppWindow.svelte';
	import Icon from './Icon.svelte';

	export let project: InternalBehanceProject;
	let prevProject = project;
	let imageIndex = 0;

	const windowIsPortrait = window.innerHeight > window.innerWidth;

	$: images = project.images;

	$: if (project.id !== prevProject.id) {
		prevProject = project;
		imageIndex = 0;
	}
</script>

<AppWindow bind:entity={project}>
	<section class="gallery">
		<figure>
			<img src={images[imageIndex]} alt={`main-image-${imageIndex}`} />
		</figure>

		<div class="carousel">
			{#each images as image, index}
				<img
					class:active={imageIndex === index}
					src={image}
					alt={image}
					on:click={() => (imageIndex = index)}
				/>
			{/each}
		</div>
	</section>
	<div style="display:contents" slot="minimise-icon"><Icon simpleIcon={BehanceIcon} /></div>
</AppWindow>

<style lang="scss">
	$carouselHeight: min(180px, calc(var(--space-xxxl) * 2.5));
	.gallery {
		height: 100%;
		width: 100%;
		overflow-y: hidden;
		background: var(--bg-1);
	}
	figure {
		height: calc(100% - #{$carouselHeight});
		padding: var(--space);
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
			height: 100%;
			border-radius: var(--space);
			background: var(--bg-2);
		}
	}
	.carousel {
		display: flex;
		width: 100%;
		height: $carouselHeight;
		overflow-x: auto;
		overflow-y: hidden;
		padding: var(--space);
		img {
			height: 100%;
			background: var(--bg-2);
			cursor: pointer;
			opacity: 0.8;
			transition: opacity 0.1s ease;
			border-radius: var(--space-s);
			& + img {
				margin-left: var(--space);
			}
			&:hover {
				opacity: 1;
			}
			&.active {
				box-shadow: 0px 0px 0px 2px var(--copy-1);
			}
		}
	}
</style>
