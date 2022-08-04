<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { Image } from 'lucide-svelte';
</script>

<svelte:head>
	<title>photos | haydon lam</title>
</svelte:head>
<div>
	<Image />
</div>

<style>
	div {
		display: grid;
		place-items: center;
		width: 100%;
	}
</style>
