<script context="module" lang="ts">
	// loading images on each request was expensive
	import { projects as projectsMockData } from '$lib/mocks/photos';
	import { dev } from '$app/env';
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }: { fetch: any }) {
		if (dev)
			return { props: { projects: projectsMockData }, stuff: { projects: projectsMockData } };
		const url = '/api/behance/all.json';

		const res = await fetch(url);

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}

		const projects = await res.json();
		return { props: { projects }, stuff: { projects } };
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { InternalBehanceProject } from '$types/behance';
	import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
	import Sidebar from '$lib/components/shared/Sidebar.svelte';
	import { blockNavigationLoader } from '../__layout.svelte';

	$: projectId = Number($page.params.projectId || 0);
	export let projects: InternalBehanceProject[];
</script>

<div class="sidebar-layout" class:photo-view={!!projectId}>
	<Sidebar>
		{#each projects as project}
			<SidebarItem
				title={project.name}
				iconHref={project.url}
				active={project?.id === projectId}
				on:click={() => {
					$blockNavigationLoader = true;
					goto(project?.id === projectId ? '/photos' : `/photos/${project?.id}`);
				}}
			>
				<svelte:fragment slot="details">
					<span>Last Modified: {project.modified_date}</span>
				</svelte:fragment>
			</SidebarItem>
		{/each}
	</Sidebar>
	<section class="photo-content" class:photo-view={!!projectId}>
		<slot />
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
