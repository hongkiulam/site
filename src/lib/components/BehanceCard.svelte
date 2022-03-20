<script lang="ts">
	import { siBehance } from 'simple-icons/icons';
	import EyeIcon from 'svelte-feather-icons/src/icons/EyeIcon.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { BehanceProjectOverview } from '$types/behance';
	import tooltip from '$lib/utils/tooltip';

	export let project: BehanceProjectOverview;
</script>

<Card>
	<div class="behance-card">
		<div class="details">
			<header><p>{project.name}</p></header>
			<footer>
				<a
					href={project.url}
					target="_blank"
					use:tooltip={{ message: 'Open in Behance' }}
					data-cursor="drag"
				>
					<Icon simpleIcon={siBehance} hoverColor="var(--primary)" />
				</a>
				<button on:click use:tooltip={{ message: 'View now in gallery' }} data-cursor="drag">
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
	.behance-card {
		--cover-width: 180px;
		--cover-height: calc(var(--cover-width) * 18 / 23);
		display: flex;
		flex-direction: column;
		padding: var(--space);
		width: 100%;
		height: var(--cover-height);
		position: relative;
		border-radius: inherit;
	}
	.details {
		z-index: 1;
		width: calc(100% - var(--cover-width));
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
		width: var(--cover-width);
		height: var(--cover-height);
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
			opacity: 0.3;
			transition: opacity 0.3s;
		}
	}
	.behance-card:hover figure::after {
		opacity: 0;
	}

	@media only screen and (max-width: 600px) {
		.behance-card {
			--cover-width: 100%;
			--cover-height: auto;
			height: auto;
			overflow: hidden;
			figure {
				top: 50%;
				transform: translateY(-50%);
				&::after {
					opacity: 0.9;
				}
			}
		}
		.behance-card:hover figure::after {
			opacity: 0.5;
		}
		.details {
			width: 100%;
		}
	}
</style>
