<script context="module" lang="ts">
	// loading images on each request was expensive
	import { projects as projectsMockData } from '$lib/mocks/photos';
	import { dev } from '$app/env';
	export const prerender = true;
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }) {
		if (dev) return { props: { projects: projectsMockData } };
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
	import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
	import BehanceLightbox from '$lib/components/BehanceLightbox.svelte';
	import Sidebar from '$lib/components/shared/Sidebar.svelte';

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
	<Sidebar>
		{#each projects as project}
			<SidebarItem
				{project}
				active={selectedProject === project}
				on:click={() => {
					selectedProject = selectedProject === project ? undefined : project;
				}}
			/>
		{/each}
	</Sidebar>
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
	images={selectedProject?.images || []}
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
		cursor: pointer;
	}
	@media only screen and (max-width: 600px) {
		.macy-container {
			display: none;
		}
	}
</style>
