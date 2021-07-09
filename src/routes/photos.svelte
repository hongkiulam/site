<script context="module" lang="ts">
	// loading images on each request was expensive
	export const prerender = true;

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const url = '/api/behance/all.json';

		const res = await fetch(url);

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}

		const projects = await res.json();
		// create a promise for each project which fetches its images
		const photoProjectImagesPromises: { id: number; data: string[] }[] = projects.map(
			async (project) => {
				const response = await fetch(
					`./api/behance/project.json?projectId=${project.id}&projectSlug=${project.slug}`
				);
				const data = await response.json();
				return { id: project.id, data };
			}
		);
		const photoProjectImages = await Promise.all(photoProjectImagesPromises);
		const imagesByProjectId: BehanceImagesByProjectId = {};
		photoProjectImages.forEach(({ id, data }) => {
			imagesByProjectId[id] = data;
		});
		return { props: { projects, imagesByProjectId } };
	}
</script>

<script lang="ts">
	import BehanceWindow from '$lib/components/BehanceWindow.svelte';
	import BehanceCard from '$lib/components/BehanceCard.svelte';
	import CardContainer from '$lib/components/CardContainer.svelte';

	import type { BehanceProjectOverview, BehanceImagesByProjectId } from '$types/behance';

	export let projects: BehanceProjectOverview[];
	export let imagesByProjectId: BehanceImagesByProjectId;
	let selectedProject: BehanceProjectOverview;
</script>

<svelte:head>
	<title>photos | haydon lam</title>
</svelte:head>

<CardContainer>
	{#each projects as project}
		<BehanceCard
			{project}
			on:click={() => {
				selectedProject = project;
			}}
		/>
	{/each}
</CardContainer>
{#if selectedProject}
	<BehanceWindow
		bind:project={selectedProject}
		images={imagesByProjectId[selectedProject?.id] || []}
	/>
{/if}
