<script lang="ts">
	import { ExternalLink, Image } from 'lucide-svelte';
	import Masonry from 'svelte-bricks';
	import { beforeNavigate } from '$app/navigation';
	import type { InternalBehanceProject } from '$types/behance';
	import BehanceImage from '$lib/components/photos/BehanceImage.svelte';
	import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
	import Sidebar from '$lib/components/shared/Sidebar.svelte';
	import SidebarLayout from '$lib/components/SidebarLayout.svelte';

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

<SidebarLayout class={!!selectedProject ? ' photo-view' : ''}>
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
</SidebarLayout>

<style>
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
		.photo-view > :global(ul) {
			display: none;
		}
		.photo-content:not(.photo-view) {
			display: none;
		}
	}
</style>
