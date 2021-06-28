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

	export let repos: EnhancedGithubRepo[];
	let selectedRepo: EnhancedGithubRepo;
</script>

<svelte:head>
	<title>code | haydon lam</title>
</svelte:head>

<section>
	{#each repos as repo}
		<GithubCard {repo} on:click={() => (selectedRepo = repo)} />
	{/each}
</section>
{#if selectedRepo}
	<Github1sWindow bind:repo={selectedRepo} />
{/if}

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--space) * 30), 1fr));
		gap: var(--space);
	}
	@media only screen and (max-width: 500px) {
		section {
			grid-template-columns: 1fr;
		}
	}
</style>
