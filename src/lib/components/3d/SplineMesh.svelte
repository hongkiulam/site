<script lang="ts">
	import type { ThreeGraphNode } from '$lib/utils/threlte';
	import { InteractiveObject, T } from '@threlte/core';
	import { createEventDispatcher } from 'svelte';
	import type { Material, BufferGeometry, Mesh } from 'three';

	const dispatch = createEventDispatcher<{
		hover: boolean;
	}>();
	export let node: ThreeGraphNode;
	export let ref: Mesh<BufferGeometry, Material | Material[]> | undefined = undefined;
	export let interactive: boolean = false;
</script>

<T.Mesh
	geometry={node.geometry}
	material={node.material}
	position={node.position}
	rotation={node.rotation}
	castShadow={node.castShadow}
	receiveShadow={node.receiveShadow}
	scale={node.scale}
	bind:ref
	let:ref={object}
>
	<InteractiveObject
		{object}
		{interactive}
		on:click
		on:pointerenter={() => {
			dispatch('hover', true);
		}}
		on:pointerleave={() => {
			dispatch('hover', false);
		}}
	/>
	<slot />
</T.Mesh>
