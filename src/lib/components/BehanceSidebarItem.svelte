<script lang="ts">
	import { siBehance } from 'simple-icons/icons';
	import type { InternalBehanceProject } from '$types/behance';
	import Icon from './Icon.svelte';
	export let project: InternalBehanceProject;
	export let active: boolean = false;
</script>

<button on:click class:active class="behance-sidebar-item">
	<figure>
		<img src={project.covers['230']} alt={`${project.name} cover`} />
	</figure>
	<div class="contents">
		<h4>{project.name}</h4>
		<a class="behance-button" href={project.url} target="_blank">
			<Icon simpleIcon={siBehance} hoverColor="var(--primary)" size={20} />
		</a>
	</div>
</button>

<style lang="scss">
	.behance-sidebar-item {
		position: relative;
		color: inherit;
		width: 100%;
		text-align: left;
		padding: var(--space-s);
		border-radius: var(--space-s);
		border: 2px solid transparent;
		opacity: 0.5;
		overflow: hidden;
		&:hover,
		&.active {
			background-color: var(--bg-2);
			opacity: 0.75;
		}
		&.active {
			opacity: 1;
			border-color: var(--primary);
		}
		& + :global(.behance-sidebar-item) {
			margin-top: var(--space);
		}
	}

	.contents {
		width: 100%;
		display: flex;
		justify-content: space-between;
		isolation: isolate;
	}
	.contents h4 {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	figure {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: 0;
		overflow: hidden;
	}
	figure img {
		width: 100%;
		transform: translateY(-50%);
		pointer-events: none;
	}
	.behance-sidebar-item:hover figure {
		opacity: 0.05;
	}
	.behance-sidebar-item.active figure {
		opacity: 0.1;
	}
	.behance-button {
		position: relative;
		display: flex;
		align-items: center;
		opacity: 0;
		margin-left: var(--space);
	}
	.behance-sidebar-item {
		&:hover,
		&.active {
			.behance-button {
				opacity: 1;
			}
		}
	}
	@media only screen and (max-width: 600px) {
		.behance-sidebar-item {
			opacity: 1;
			padding-block: var(--space);
			padding-inline: var(--space-l);
		}
		.behance-sidebar-item {
			&:hover,
			&.active {
				background-color: transparent;
				border-color: transparent;
				opacity: 1;
			}
		}

		figure {
			opacity: 0.2 !important;
		}
		.behance-button {
			opacity: 1;
		}
	}
</style>
