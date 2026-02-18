<script lang="ts">
	import type { CSSColor } from '$lib/utils/css-variables';
	import { cssColorVar } from '$lib/utils/css-variables';
	import { darkMode } from '$lib/utils/dark-mode';
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';

	export let color: CSSColor;

	let DOMLoaded = '0';
	onMount(() => {
		// for some reason, the colours weren't updating on the initial frame to reflect
		// the css colors, rather they were still using the colors from spline
		// forcing a rerender on the next frame seems to work
		window.requestAnimationFrame(() => {
			DOMLoaded = '1';
		});
	});
	$: key = DOMLoaded + ($darkMode ? '1' : '0');
</script>

{#key key}
	<T.MeshPhongMaterial color={cssColorVar(color)} />
{/key}
