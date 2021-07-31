<script lang="ts">
	import type { InternalBehanceProject } from '$types/behance';

	import BehanceIcon from 'simple-icons/icons/behance.js';
	import { onDestroy, onMount } from 'svelte';
	import AppWindow from './AppWindow.svelte';
	import Icon from './Icon.svelte';
	import Loader from './Loader.svelte';

	export let project: InternalBehanceProject;

	let prevProject = project;
	let imageIndex = 0;
	let images: string[] = [];

	// vars for lazy loading images
	let loadingRemainingImages = true;
	let lazyLoadImagesTimeout: number;
	const LAZY_LOAD_TIMEOUT = 1000;
	// vars for dynamically resizing images based on available container space
	let imageBindingConstraint: 'y' | 'x' = 'y';
	let mainImageContainer: HTMLElement;
	let mainImageEl: HTMLElement;
	let imageBindingTick: number;
	const IMAGE_BINDING_INTERNAL = 100;

	const loadRemainingImages = () => {
		images = project.images;
		loadingRemainingImages = false;
		window.clearTimeout(lazyLoadImagesTimeout);
	};

	const checkImageBounds = () => {
		if (!mainImageContainer || !mainImageEl) return;
		const containerW = mainImageContainer.offsetWidth;
		const containerH = mainImageContainer.offsetHeight;
		const imageW = mainImageEl.offsetWidth;
		const imageH = mainImageEl.offsetHeight;

		if (imageW > containerW) {
			imageBindingConstraint = 'x';
		}
		if (imageH > containerH) {
			imageBindingConstraint = 'y';
		}
	};

	const onImageChange = (index: number) => (e: MouseEvent) => {
		// change image
		imageIndex = index;
		// scroll image into view
		const clickedImageEl = e.target as EventTarget & HTMLElement;
		const carousel = clickedImageEl.parentNode as HTMLElement;

		const imagePositionInCarousel = clickedImageEl.offsetLeft;
		const imageWidth = clickedImageEl.offsetWidth;
		const imageCenterPosition = imagePositionInCarousel + imageWidth / 2;
		const carouselWidth = carousel.offsetWidth;
		const imagePositionAtCarouselCenter = imageCenterPosition - carouselWidth / 2;
		carousel.scrollTo({
			left: imagePositionAtCarouselCenter,
			behavior: 'smooth'
		});
	};

	$: if (project.id !== prevProject.id) {
		// when project changes load first image
		images = [project.images[0]];
		// start lazy loading remaining images
		loadingRemainingImages = true;
		prevProject = project;
		imageIndex = 0;
		lazyLoadImagesTimeout = window.setTimeout(loadRemainingImages, LAZY_LOAD_TIMEOUT);
	}

	onMount(() => {
		images = [project.images[0]];
		lazyLoadImagesTimeout = window.setTimeout(loadRemainingImages, LAZY_LOAD_TIMEOUT);
		imageBindingTick = window.setInterval(checkImageBounds, IMAGE_BINDING_INTERNAL);
	});

	onDestroy(() => {
		window.clearInterval(imageBindingTick);
		window.clearTimeout(lazyLoadImagesTimeout);
	});
</script>

<AppWindow bind:entity={project}>
	<section class="gallery">
		<figure bind:this={mainImageContainer}>
			<img
				class={imageBindingConstraint}
				src={images[imageIndex]}
				alt={`main-image-${imageIndex}`}
				bind:this={mainImageEl}
			/>
		</figure>

		<div class="carousel">
			{#each images as image, index}
				<img
					class:active={imageIndex === index}
					src={image}
					alt={image}
					on:click={onImageChange(index)}
				/>
			{/each}
			{#if loadingRemainingImages}
				<sdiv class="image-loader"><Loader /></sdiv>
			{/if}
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
			border-radius: var(--space);
			background: var(--bg-2);
			transition: all 0.3s ease;
			&.y {
				height: 100%;
			}
			&.x {
				width: 100%;
			}
			&.portrait {
				height: auto;
				width: 100%;
			}
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
	.image-loader {
		margin: auto var(--space-l);
	}
</style>
