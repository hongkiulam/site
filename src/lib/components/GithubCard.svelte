<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import GithubIcon from 'svelte-feather-icons/src/icons/GithubIcon.svelte';
	import VscodeIcon from 'simple-icons/icons/visualstudiocode.js';
	import type { EnhancedGithubRepo } from '$types/github';

	export let repo: EnhancedGithubRepo;
</script>

<article>
	<header>
		<h2>{repo.name} <small>{repo.pinned ? '✨' : ''}</small></h2>
		<div class="icons">
			<a href={repo.html_url} target="_blank">
				<Icon featherIcon={GithubIcon} hoverColor="var(--primary)" />
			</a>
			<button on:click>
				<Icon simpleIcon={VscodeIcon} hoverColor="var(--primary)" />
			</button>
		</div>
	</header>
	<p class="description">{repo.description || '-no description-'}</p>
	<footer>
		{#each repo.languages.slice(0, 5).map((l) => l.toLowerCase()) as language}
			<span
				><svg
					class="color-{language}"
					viewBox="0 0 16 16"
					version="1.1"
					width="16"
					height="16"
					aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z" /></svg
				>{language}</span
			>
		{/each}
	</footer>
</article>

<style lang="scss">
	@import url('https://quickutils.github.io/language-colors/language-colors.css');

	article {
		display: flex;
		flex-direction: column;
		color: var(--copy-2);
		background: var(--bg-2);
		padding: var(--space);
		border: 2px solid transparent;
		border-radius: var(--space);
		&:hover {
			border-color: var(--primary);
		}
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		h2 {
			line-height: 1em;
		}
		.icons {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space);
			line-height: 0px;
		}
	}
	.description {
		margin: var(--space) 0;
	}
	footer {
		margin-top: auto;
		[class*='color'] {
			fill: currentColor;
			vertical-align: middle;
			stroke: var(--copy-2);
		}
		span + span {
			margin-left: var(--space-s);
		}
	}
</style>
