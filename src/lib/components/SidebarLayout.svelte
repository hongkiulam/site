<script lang="ts">
	let klass: string = '';
	export { klass as class };
</script>

<div class="sidebar-layout{klass}">
	<slot />
</div>

<style>
	.sidebar-layout {
		display: flex;
		height: calc(100vh - var(--nav-height) - var(--spacing-2));
		margin-top: var(--nav-height);
	}
	.sidebar-layout :global(::-webkit-scrollbar) {
		width: 0px;
	}
</style>
