<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async () => {
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
	};
</script>

<script lang="ts">
	import type { EnhancedGithubRepo } from '$types/github';
	import Sidebar from '$lib/components/shared/Sidebar.svelte';
	import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
	import { Code2, Github } from 'lucide-svelte';

	export let repos: EnhancedGithubRepo[];
	let selectedRepo: EnhancedGithubRepo | undefined;
</script>

<svelte:head>
	<title>code | {selectedRepo?.name || 'haydon lam'}</title>
</svelte:head>

<div class="sidebar-layout">
	<Sidebar>
		{#each repos as repo}
			<SidebarItem
				title={repo.name}
				iconHref={repo.html_url}
				active={repo?.id === selectedRepo?.id}
				on:click={() => {
					selectedRepo = selectedRepo?.id === repo.id ? undefined : repo;
				}}
			>
				<svelte:fragment slot="icon">
					<Github style="width:var(--font-size-body);height:var(--font-size-body)" />
				</svelte:fragment>
				<svelte:fragment slot="details">
					<span>{repo.description || '-no description-'}</span>
					<hr />
					<ul class="languages">
						{#each repo.languages.map((l) => l.toLowerCase()) as language}
							<li class="language-item color-{language}">
								<span class="language-text">
									{language}
								</span>
								<span class="language-shadow">{language}</span>
							</li>
						{/each}
					</ul>
				</svelte:fragment>
			</SidebarItem>
		{/each}
	</Sidebar>
	{#if selectedRepo}
		<iframe
			class="vs-code"
			src={selectedRepo.html_url.replace('github', 'github1s')}
			title={selectedRepo.name}
			frameborder="0"
			width="100%"
		/>
	{:else}
		<div class="code-icon-wrapper">
			<Code2 />
		</div>
	{/if}
</div>

<style lang="scss">
	.sidebar-layout {
		display: flex;
		height: calc(100vh - var(--nav-height) - var(--spacing-2));
	}
	.code-icon-wrapper {
		display: grid;
		place-items: center;
		width: 100%;
	}

	@import url('https://quickutils.github.io/language-colors/language-colors.css');
	.languages {
		display: flex;
		flex-wrap: wrap;
	}
	.language-item {
		display: grid;
		position: relative;
		grid-template: 1fr / 1fr;
		margin-right: var(--spacing-1);
	}
	.language-text {
		grid-column: 1/2;
		grid-row: 1/2;
		color: var(--color-copy-1);
		opacity: 0.5;
	}
	.language-shadow {
		text-shadow: 0px 0px 3px currentColor;
		grid-column: 1/2;
		grid-row: 1/2;
	}

	@media (--breakpoints-sm-max) {
		.vs-code {
			display: none;
		}
	}
</style>
