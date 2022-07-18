<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import { siBehance } from 'simple-icons/icons';
	import type { InternalBehanceProject } from '$types/behance';
	import Icon from '../Icon.svelte';
	export let project: InternalBehanceProject;
	export let active: boolean = false;
</script>

<li class="sidebar-item" use:autoAnimate>
	<button on:click class:active>
		<span class="title">{project.name}</span>
		<a class="behance-button" href={project.url} target="_blank" on:click|stopPropagation>
			<Icon simpleIcon={siBehance} hoverColor="var(--primary)" size={20} />
		</a>
	</button>
	{#if active}
		<div class="details">asdsd</div>
	{/if}
</li>

<style lang="scss">
	.sidebar-item {
		list-style: none;
		color: var(--copy-1);
		display: block;
		width: 100%;
	}
	.sidebar-item + :global(.sidebar-item) {
		margin-top: var(--space-1);
	}
	.sidebar-item button {
		display: flex;
		color: inherit;
		border-radius: var(--border-radius-s);
		padding: var(--space-1) var(--space-2);
		width: 100%;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--bg-2);
		transition: border-color 0.3s ease;
		&:hover{
			border-color: var(--copy-1);
		}
		&.active {
			border-color: var(--primary-accent);
		}
	}
	.title {
		font-size: var(--font-size-body);
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}
	.sidebar-item button a {
		line-height: 100%;
		margin-left: var(--space-1);
	}
	.details {
		display: grid;
		grid-auto-flow: row;
		gap: var(--space-0);
		padding-inline: var(--space-2);
		padding-block: var(--space-1);
		color: var(--copy-2);
	}
</style>
