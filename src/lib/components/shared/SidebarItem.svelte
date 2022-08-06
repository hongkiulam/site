<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	export let active: boolean = false;
	export let title: string;
	export let iconHref: string;
</script>

<li class="sidebar-item" use:autoAnimate>
	<button class="button" on:click class:active>
		<span class="title">{title}</span>
		<a class="behance-button" href={iconHref} target="_blank" on:click|stopPropagation={() => {}}>
			<slot name="icon" />
		</a>
	</button>
	{#if active}
		<div class="details"><slot name="details" /></div>
	{/if}
</li>

<style lang="scss">
	.sidebar-item {
		list-style: none;
		color: var(--color-copy-1);
		display: block;
		width: 100%;
	}
	.sidebar-item + :global(.sidebar-item) {
		margin-top: var(--spacing-1);
	}
	.sidebar-item .button {
		display: flex;
		color: inherit;
		border-radius: var(--border-radius-s);
		padding: var(--spacing-1) var(--spacing-2);
		width: 100%;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--color-bg-2);
		transition: border-color 0.3s ease;
		&:hover {
			border-color: var(--color-copy-1);
		}
		&.active {
			border-color: var(--color-primary-accent);
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
	.sidebar-item .button a {
		line-height: 100%;
		margin-left: var(--spacing-1);
	}
	.details {
		display: grid;
		grid-auto-flow: row;
		gap: var(--spacing-0);
		padding-inline: var(--spacing-2);
		padding-block: var(--spacing-1);
		color: var(--color-copy-2);
		font-size: var(--font-size-small);
	}
</style>
