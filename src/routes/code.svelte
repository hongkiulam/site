<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const url = '/api/github.json';

		const res = await fetch(url);

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load ${url}`)
			};
		}

		const repos: EnhancedGithubRepo[] = await res.json();

		return { props: { repos } };
	}
</script>

<script lang="ts">
	import type { EnhancedGithubRepo } from '$types/github';
	import GithubCard from '$lib/components/GithubCard.svelte';
	import Github1sWindow from '$lib/components/Github1sWindow.svelte';
	import CardContainer from '$lib/components/CardContainer.svelte';

	export let repos: EnhancedGithubRepo[];
	let selectedRepo: EnhancedGithubRepo;
</script>

<svelte:head>
	<title>code | haydon lam</title>
</svelte:head>

<CardContainer>
	{#each repos as repo}
		<GithubCard {repo} on:click={() => (selectedRepo = repo)} />
	{/each}
</CardContainer>
{#if selectedRepo}
	<Github1sWindow bind:repo={selectedRepo} />
{/if}
