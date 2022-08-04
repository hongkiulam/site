<script context="module">
	export const prerender = true;
</script>

<script>
	import Me from '$lib/components/Me.svelte';
</script>

<svelte:head>
	<title>home | haydon lam</title>
</svelte:head>
<div class="home-container">
	<Me />
</div>

<style>
	.home-container {
		width: 100%;
		height: calc(100vh - var(--nav-height) - var(--spacing-2));
		display: grid;
		place-items: center;
	}
</style>
