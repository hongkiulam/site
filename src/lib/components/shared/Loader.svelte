<script lang="ts">
	import { Minus } from 'lucide-svelte';
	export let size: number = 36;
</script>

<div class="loader">
	<Minus {size} />
</div>

<style>
	.loader {
		animation: spin 1s infinite;
		display: flex;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
