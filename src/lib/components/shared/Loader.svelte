<script lang="ts">
	import MinusIcon from 'svelte-feather-icons/src/icons/MinusIcon.svelte';
	import Icon from '$lib/components/Icon.svelte';
	export let size: number = 36;
</script>

<div class="loader">
	<Icon featherIcon={MinusIcon} {size} />
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
