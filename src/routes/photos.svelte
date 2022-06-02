<script context="module" lang="ts">
	// loading images on each request was expensive
	export const prerender = true;

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }) {
		const url = '/api/behance/all.json';

		const res = await fetch(url);

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}

		const projects = await res.json();

		return { props: { projects } };
	}
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import type { MacyOptions, MacyInstance } from 'svelte-macy';
	import type { InternalBehanceProject } from '$types/behance';
	import BehanceSidebarItem from '$lib/components/BehanceSidebarItem.svelte';
	import BehanceLightbox from '$lib/components/BehanceLightbox.svelte';

	export let projects: InternalBehanceProject[];
	let selectedProject: InternalBehanceProject = projects[0];
	let MacyComponent;
	let macy: MacyInstance;
	let macyOptions: MacyOptions = {};

	if (browser) {
		onMount(async () => {
			MacyComponent = (await import('svelte-macy')).Macy;
			macyOptions = {
				columns: 5,
				margin: Number(
					window
						.getComputedStyle(document.documentElement)
						.getPropertyValue('--space')
						?.replace('px', '') || 16
				),
				breakAt: {
					1100: { columns: 1 },
					1500: { columns: 2 },
					1800: { columns: 3 },
					2000: { columns: 4 }
				}
			};
		});
	}
	$: if (macy) {
		macy.runOnImageLoad(() => {
			macy.recalculate(true, true);
		}, true);
	}

	// lightbox state
	let lightboxImageIndex = undefined;
</script>

<svelte:head>
	<title>photos | haydon lam</title>
</svelte:head>

<div class="sidebar-layout">
	<aside>
		{#each projects as project}
			<BehanceSidebarItem
				{project}
				active={selectedProject === project}
				on:click={() => {
					selectedProject = project;
				}}
			/>
		{/each}
	</aside>
	<div class="macy-container">
		{#key selectedProject}
			<svelte:component this={MacyComponent} bind:macy options={macyOptions}>
				{#each selectedProject?.images || [] as image, index}
					<img
						src={image[600].srcset}
						style="width:{image[600].width}; height={image[600].height}"
						alt=""
						loading="lazy"
						on:click={() => {
							lightboxImageIndex = index;
						}}
					/>
				{/each}
			</svelte:component>
		{/key}
	</div>
</div>
<BehanceLightbox
	images={selectedProject.images}
	imageIndex={lightboxImageIndex}
	on:close={() => {
		lightboxImageIndex = undefined;
	}}
/>

<style>
	.sidebar-layout {
		display: flex;
		height: calc(100vh - (var(--space-xxxl) + (2 * var(--space-xxl))));
		overflow: hidden;
	}
	.sidebar-layout ::-webkit-scrollbar {
		width: 0px;
	}
	aside {
		flex: 1 0 250px;
		max-width: 250px;
		margin-right: var(--space-l);
		overflow-y: auto;
	}

	.macy-container {
		display: flex;
		width: 100%;
		overflow: auto;
	}
	.macy-container :global(#macy) {
		width: 100%;
	}
	img {
		width: 100%;
	}
	@media only screen and (max-width: 600px) {
		aside {
			max-width: unset;
			flex-basis: 100%;
		}
		.macy-container {
			display: none;
		}
	}
</style>
