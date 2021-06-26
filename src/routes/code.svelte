<script context="module" lang="ts">
	import { variables } from '$lib/variables';
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const url = 'https://api.github.com/users/hongkiulam/repos?sort=updated';

		const reposRes = await fetch(url, {
			headers: {
				Authorization: 'token ' + variables.github_token
			}
		});

		if (!reposRes.ok) {
			return {
				status: reposRes.status,
				error: new Error(`Could not load ${url}`)
			};
		}

		const repos: GithubRepo[] = await reposRes.json();

		const repoLanguagePromises = repos.map(
			(repo) =>
				fetch(repo.languages_url, {
					headers: {
						Authorization: 'token ' + variables.github_token
					}
				}) as Promise<Response>
		);

		const languagesRes = await Promise.all(repoLanguagePromises);
		const languages = await Promise.all(
			languagesRes.map((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return {};
				}
			})
		);
		const languagesByRepoId = {};
		languages.map((language, index) => {
			languagesByRepoId[repos[index].id] = Object.keys(language);
		});
		return {
			props: {
				repos,
				languagesByRepoId
			}
		};
	}
</script>

<script lang="ts">
	import type { GithubRepo } from '$types/github';
	import GithubCard from '$lib/components/GithubCard.svelte';

	export let repos: GithubRepo[];
	export let languagesByRepoId: any;
	let selectedRepoUrl: string;
</script>

<svelte:head>
	<title>code | haydon lam</title>
</svelte:head>

<section>
	{#each repos as repo}
		<GithubCard {repo} languages={languagesByRepoId[repo.id]} />
	{/each}
</section>

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
