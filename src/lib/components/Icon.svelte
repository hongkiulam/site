<script lang="ts">
	export let featherIcon: any = undefined;
	export let simpleIcon: SimpleIcon = undefined;
	export let size: number = 24;
	export let hoverColor: string = undefined;
</script>

<div
	class="icon-styler"
	class:feather={!!featherIcon}
	class:simple={!!simpleIcon}
	style="--size: {size}px;{hoverColor ? `--hover-color: ${hoverColor}` : ''}"
>
	{#if featherIcon}
		<svelte:component this={featherIcon} />
	{/if}
	{#if simpleIcon}
		{@html simpleIcon.svg}
	{/if}
</div>

<style lang="scss">
	.icon-styler {
		display: contents;
	}
	.icon-styler :global(svg) {
		width: var(--size);
		height: var(--size);
	}
	.icon-styler.feather :global(svg) {
		stroke: var(--color-copy-1);
		&:hover {
			stroke: var(--hover-color, var(--color-copy-1));
		}
	}
	.icon-styler.simple :global(svg) {
		fill: var(--color-copy-1);
		&:hover {
			fill: var(--hover-color, var(--color-copy-1));
		}
	}
</style>
