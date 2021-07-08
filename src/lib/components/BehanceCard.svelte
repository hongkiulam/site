<script lang="ts">
	import BehanceIcon from 'simple-icons/icons/behance.js';
	import EyeIcon from 'svelte-feather-icons/src/icons/EyeIcon.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { BehanceProjectOverview } from '$types/behance';

	export let project: BehanceProjectOverview;
</script>

<Card>
	<div class="behance-card">
		<div class="details">
			<header><p>{project.name}</p></header>
			<footer>
				<a href={project.url} target="_blank">
					<Icon simpleIcon={BehanceIcon} hoverColor="var(--primary)" />
				</a>
				<button on:click>
					<Icon featherIcon={EyeIcon} hoverColor="var(--primary)" />
				</button>
			</footer>
		</div>
		<figure>
			<img src={project.covers['230']} alt={`${project.name} cover`} />
		</figure>
	</div>
</Card>

<style lang="scss">
	$coverWidth: 180px;
	$coverHeight: calc(#{$coverWidth} * 18 / 23);
	.behance-card {
		display: flex;
		flex-direction: column;
		padding: var(--space);
		width: 100%;
		height: 100%;
		position: relative;
		height: $coverHeight;
		border-radius: inherit;
	}
	.details {
		z-index: 1;
		width: calc(100% - #{$coverWidth});
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	footer {
		display: grid;
		grid-template-columns: min-content min-content;
		gap: var(--space);
	}
	.behance-card figure {
		width: $coverWidth;
		height: $coverHeight;
		position: absolute;
		right: 0;
		top: 0;
		border-radius: inherit;

		img {
			border-radius: inherit;
			width: 100%;
			height: 100%;
		}

		&::after {
			display: block;
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: var(--bg-2);
			opacity: 0.2;
			transition: opacity 0.3s;
		}
	}
	.behance-card:hover figure::after {
		opacity: 0;
	}
</style>
