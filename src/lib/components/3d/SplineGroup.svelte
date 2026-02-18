<script lang="ts">
	import type { ThreeGraphNode } from '$lib/utils/threlte';
	import { T } from '@threlte/core';
	export let node: ThreeGraphNode;
</script>

<T.Group position={node.position} rotation={node.rotation} scale={node.scale}>
	<slot />
</T.Group>
