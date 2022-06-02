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
	import BehanceWindow from '$lib/components/BehanceWindow.svelte';
	import BehanceCard from '$lib/components/BehanceCard.svelte';
	import CardContainer from '$lib/components/CardContainer.svelte';

	import type { InternalBehanceProject } from '$types/behance';

	export let projects: InternalBehanceProject[];
	let selectedProject: InternalBehanceProject;
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
	<BehanceWindow bind:project={selectedProject} />
{/if}
