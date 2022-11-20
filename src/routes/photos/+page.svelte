<script lang="ts">
	import { ExternalLink, Image } from 'lucide-svelte';
	import Masonry from 'svelte-bricks';
	import { beforeNavigate } from '$app/navigation';
	import type { InternalBehanceProject } from '$types/behance';
	import BehanceImage from '$lib/components/photos/BehanceImage.svelte';
	import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
	import Sidebar from '$lib/components/shared/Sidebar.svelte';

	export let data: import('./$types').PageData;
	$: projects = data?.projects;
	let selectedProject: InternalBehanceProject | undefined;

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
			<div class="masonry-container">
				{#key selectedProject?.id}
					<Masonry
						animate={false}
						minColWidth={250}
						maxColWidth={600}
						items={selectedProject?.images || []}
						getId={(item) => Object.values(item)[0].srcset}
						let:item
					>
						<BehanceImage behanceImage={item} />
					</Masonry>
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
	.masonry-container {
		display: flex;
		width: 100%;
		overflow: auto;
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
