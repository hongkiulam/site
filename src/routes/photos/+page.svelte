<script lang="ts">
	import { onMount, SvelteComponentTyped } from 'svelte';
	import { ExternalLink, Image } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import type { InternalBehanceProject } from '$types/behance';
	import BehanceImage from '$lib/components/photos/BehanceImage.svelte';
	import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
	import Sidebar from '$lib/components/shared/Sidebar.svelte';
	import type { MacyOptions, MacyInstance } from 'svelte-macy';

	export let data: import('./$types').PageData;
	$: projects = data?.projects;
	let selectedProject: InternalBehanceProject | undefined;

	let MacyComponent: SvelteComponentTyped;
	let macy: MacyInstance;
	let macyOptions: MacyOptions = {};

	if (browser) {
		onMount(async () => {
			console.log('mount');
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
	beforeNavigate(({ cancel }) => {
		if (selectedProject && window.innerWidth <= 600) {
			cancel();
			selectedProject = undefined;
		}
	});
</script>

<svelte:head>
	<title>
		photos | {selectedProject?.name || 'haydon lam'}
	</title>
</svelte:head>

<div class="sidebar-layout" class:photo-view={!!selectedProject}>
	<Sidebar>
		{#each projects || [] as project}
			<SidebarItem
				title={project.name}
				iconHref={project.url}
				active={project?.id === selectedProject?.id}
				on:click={() => {
					selectedProject = selectedProject?.id === project.id ? undefined : project;
				}}
			>
				<svelte:fragment slot="icon">
					<ExternalLink style="width:var(--font-size-body);height:var(--font-size-body)" />
				</svelte:fragment>

				<svelte:fragment slot="details">
					<span>{project.images.length} Photo(s)</span>
					<span>Last Modified: {project.modified_date}</span>
				</svelte:fragment>
			</SidebarItem>
		{/each}
	</Sidebar>
	<section class="photo-content" class:photo-view={!!selectedProject}>
		{#if selectedProject}
			<div class="macy-container">
				{#key selectedProject?.id}
					<svelte:component this={MacyComponent} bind:macy options={macyOptions}>
						{#each selectedProject?.images || [] as image}
							<BehanceImage behanceImage={image} />
						{/each}
					</svelte:component>
				{/key}
			</div>
		{:else}
			<div class="image-icon-wrapper">
				<Image />
			</div>
		{/if}
	</section>
</div>

<style>
	.sidebar-layout {
		display: flex;
		height: calc(100vh - var(--nav-height) - var(--spacing-2));
	}
	.sidebar-layout :global(::-webkit-scrollbar) {
		width: 0px;
	}
	.photo-content {
		display: contents;
	}
	.image-icon-wrapper {
		display: grid;
		place-items: center;
		width: 100%;
	}
	.macy-container {
		display: flex;
		width: 100%;
		overflow: auto;
	}
	.macy-container :global(#macy) {
		width: 100%;
	}
	@media (--breakpoints-sm-max) {
		/* the sidebar */
		.sidebar-layout.photo-view > :global(ul) {
			display: none;
		}
		.photo-content:not(.photo-view) {
			display: none;
		}
	}
</style>
