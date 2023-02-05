<script lang="ts">
	import { T } from '@threlte/core';
	import SplineMesh from './SplineMesh.svelte';
	import type { ThreeGraphNode } from '$lib/utils/threlte';

	export let node: ThreeGraphNode;
</script>

<!--
@component
This component takes a group object and renders it along with all it's descendants
It uses `<SplineMesh>` to render the descendants by default

If more customisation is required in the children mesh's, then the group and children
will have to be constructed manually using `<T.Group>` and `<SplineMesh>`
-->
<T.Group position={node.position} rotation={node.rotation} scale={node.scale} name={node.name}>
	{#each node.children as child}
		{#if child.type === 'Group'}
			<svelte:self node={child} />
		{/if}
		{#if child.type === 'Mesh'}
			<SplineMesh node={child} />
		{/if}
	{/each}
</T.Group>
