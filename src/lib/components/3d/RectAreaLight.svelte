<!-- For my use case the RectAreaLightUniformsLib is not needed -->
<!-- https://threejs.org/docs/#api/en/lights/RectAreaLight -->
<script lang="ts">
	import type { ThreeGraphNode } from '$lib/utils/threlte';
	import { SceneGraphObject, T } from '@threlte/core';
	import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
	export let node: ThreeGraphNode;
	export let color: string;
</script>

<!-- https://threlte.xyz/core/three#slot-props -->

<T.RectAreaLight
	intensity={1}
	width={node.geometry._width}
	height={node.geometry._height}
	position={node.position}
	rotation={node.rotation}
	{color}
	let:ref={rectAreaLight}
>
	<!-- https://threlte.xyz/core/scene-graph-object#basic-example -->
	<SceneGraphObject object={new RectAreaLightHelper(rectAreaLight)} />
</T.RectAreaLight>
