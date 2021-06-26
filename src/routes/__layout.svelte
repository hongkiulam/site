<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
</script>

<div>
	<Nav />
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		padding: 0 var(--space-xxl);
	}
	main {
		padding: var(--space-xxl) 0;
	}
</style>
