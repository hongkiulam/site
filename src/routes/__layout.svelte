<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
</script>

<style>
	main {
		padding: 0 var(--space-xxl);
	}
</style>

<main>
	<Nav />
	<slot />
</main>
