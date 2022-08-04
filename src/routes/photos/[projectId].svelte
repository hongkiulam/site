<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const prerender = true;

	export const load: Load = async ({ stuff, params }) => {
		// stuff comes from parent layout
		const projectId = Number(params.projectId || -1);
		const projects = stuff.projects as InternalBehanceProject[];
		const project = projects.find((p) => p.id === projectId);
		return { props: { project } };
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { onMount, SvelteComponentTyped } from 'svelte';
	import type { MacyOptions, MacyInstance } from 'svelte-macy';
	import autoAnimate from '@formkit/auto-animate';
	import type { InternalBehanceProject } from '$types/behance';
	import BehanceImage from '$lib/components/photos/BehanceImage.svelte';
	export let project: InternalBehanceProject;
	let MacyComponent: SvelteComponentTyped;
	let macy: MacyInstance;
	let macyOptions: MacyOptions = {};

	if (browser) {
		onMount(async () => {
			MacyComponent = (await import('svelte-macy')).Macy as any;
			macyOptions = {
				columns: 5,
				margin: Number(
					window
						.getComputedStyle(document.documentElement)
						.getPropertyValue('--spacing-1')
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
</script>

<svelte:head>
	<title>
		photos | {project.name}
	</title>
</svelte:head>
<div class="macy-container" use:autoAnimate>
	{#key project.id}
		<svelte:component this={MacyComponent} bind:macy options={macyOptions}>
			{#each project?.images || [] as image}
				<BehanceImage behanceImage={image} />
			{/each}
		</svelte:component>
	{/key}
</div>

<style>
	.macy-container {
		display: flex;
		width: 100%;
		overflow: auto;
	}
	.macy-container :global(#macy) {
		width: 100%;
	}
</style>
