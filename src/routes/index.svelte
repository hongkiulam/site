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
		height: calc(100vh - var(--space-xxxl));
		display: grid;
		place-items: center;
	}
</style>
