<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
</script>

<main>
	<Nav />
	<slot />
</main>

<style>
	main {
		padding: 0 var(--space-xxl);
	}
</style>
