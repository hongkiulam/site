<script context="module">
	export const prerender = true;

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const aboutMarkdownReq = await fetch('/api/markdown/about.md');
		const aboutMarkdownRes = await aboutMarkdownReq.text();

		return { props: { markdown: aboutMarkdownRes } };
	}
</script>

<script lang="ts">
	import marked from 'marked';
	export let markdown: string;
	const html = marked(markdown);
</script>

<svelte:head>
	<title>about | haydon lam</title>
</svelte:head>
<section class="about">
	{@html html}
</section>

<style>
	.about {
		max-width: calc(var(--space-xxl) * 20);
	}
	.about :global(article + article) {
		margin-top: var(--space-l);
	}
	.about :global(ul) {
		margin-left: var(--space-l);
	}
</style>
