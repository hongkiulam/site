<script lang="ts">
	import { buildGraph } from '$lib/utils/threlte';
	import { Canvas, OrbitControls, T, useLoader } from '@threlte/core';
	import { degToRad } from 'three/src/math/MathUtils';
	import { createEventDispatcher, onMount } from 'svelte';
	import MeshPhongWithCssColor from './MeshPhongWithCSSColor.svelte';
	import SplineMesh from './SplineMesh.svelte';
	import RectAreaLight from './RectAreaLight.svelte';
	import SplineGroupAndMeshChildren from './SplineGroupAndMeshChildren.svelte';

	const dispatch = createEventDispatcher();
	let splineDataLoaded = false;
	let nodes: ReturnType<typeof buildGraph>['nodes'];
	let materials: ReturnType<typeof buildGraph>['materials'];

	onMount(async () => {
		const splineloader = await import('@splinetool/loader').then((mod) => mod.default);
		const loader = useLoader(splineloader, () => new splineloader());
		loader.load(
			`https://prod.spline.design/ZAS6Jqf5PXr-57mU/scene.splinecode?t=${Date.now()}`,
			(spline) => {
				const graph = buildGraph(spline);
				nodes = graph.nodes;
				materials = graph.materials;
				splineDataLoaded = true;
				dispatch('splinedataloaded');
			},
			() => {},
			(err) => {
				console.log(err);
			}
		);
	});

	// useCursor for setting pointer - perhaps just change the colour of things being hovered

	const zoomLevelToViewportRatio = 1 / 900; // zoom / pixels
	const sensibleMaxSceneWidth = 1300;
	const minZoom = 0.5;
</script>

<!-- Spline uses linear encoding for colours, this sets ctx.renderer.outputEncoding = LinearEncoding so
that colors and lighting are aligned with what is in spline -->
<!-- Rationale for flat https://github.com/pmndrs/react-three-fiber/discussions/1290 -->
<Canvas linear flat>
	{#if splineDataLoaded}
		<T.OrthographicCamera
			makeDefault
			position={nodes.sceneCamera.position}
			fov={nodes.sceneCamera.fov}
			zoom={Math.max(
				minZoom,
				Math.min(window.innerWidth, sensibleMaxSceneWidth) * zoomLevelToViewportRatio
			)}
		>
			<!-- min|maxZoom for OrthographicCamera -->
			<!-- min|maxDistance for PerspectiveCamera -->
			<OrbitControls
				maxPolarAngle={degToRad(90)}
				minPolarAngle={degToRad(30)}
				minAzimuthAngle={degToRad(10)}
				maxAzimuthAngle={degToRad(80)}
				{minZoom}
				maxZoom={6}
				minDistance={500}
				maxDistance={1750}
				enableZoom
				enablePan={true}
				enableDamping
				rotateSpeed={0.5}
			/>
		</T.OrthographicCamera>

		<T.DirectionalLight
			castShadow
			position={nodes['Directional Light'].position}
			intensity={nodes['Directional Light'].intensity}
			color={nodes['Directional Light'].color}
			scale={nodes['Directional Light'].scale}
			shadow={nodes['Directional Light'].shadow}
		/>
		<T.HemisphereLight
			intensity={nodes['Default Ambient Light'].intensity - 0.2}
			color={nodes['Default Ambient Light'].color}
		/>

		<!-- Environment Objects -->
		<SplineMesh node={nodes['wall']}>
			<MeshPhongWithCssColor color="color-bg-1" />
		</SplineMesh>
		<SplineMesh node={nodes['carpet']}>
			<MeshPhongWithCssColor color="color-bg-2" />
		</SplineMesh>

		<RectAreaLight node={nodes['windowLightPanelPlaceholder1']} color="white" />
		<RectAreaLight node={nodes['windowLightPanelPlaceholder2']} color="white" />
		<SplineMesh node={nodes['blinds1']} />
		<SplineMesh node={nodes['blinds2']} />

		<!-- Work Station Objects -->
		<T.Group position={nodes['tableParts'].position} rotation={nodes['tableParts'].rotation}>
			<SplineMesh node={nodes['tableTop']} />
			<SplineMesh node={nodes['leg']}><MeshPhongWithCssColor color="color-copy-2" /></SplineMesh>
			<SplineMesh node={nodes['leg1']}><MeshPhongWithCssColor color="color-copy-2" /></SplineMesh
			><SplineMesh node={nodes['leg2']}><MeshPhongWithCssColor color="color-copy-2" /></SplineMesh
			><SplineMesh node={nodes['leg3']}><MeshPhongWithCssColor color="color-copy-2" /></SplineMesh>
		</T.Group>
		<SplineGroupAndMeshChildren node={nodes['officeChair']} />
		<SplineGroupAndMeshChildren node={nodes['mac']} />
		<SplineGroupAndMeshChildren node={nodes['keyboard']} />

		<T.Group position={nodes['monitor'].position} rotation={nodes['monitor'].rotation}>
			<SplineMesh node={nodes['monitorFrame']}>
				<MeshPhongWithCssColor color="color-copy-2" />
			</SplineMesh>
			<SplineMesh node={nodes['monitorArm']}>
				<MeshPhongWithCssColor color="color-copy-2" />
			</SplineMesh>
			<RectAreaLight node={nodes['monitorScreen']} color="#e2fcff" />
		</T.Group>

		<SplineGroupAndMeshChildren node={nodes['mouse']} />
		<SplineMesh node={nodes['bin']}>
			<MeshPhongWithCssColor color="color-bg-2" /></SplineMesh
		>

		<!-- Picture Objects -->
		<T.Group position={nodes['picture1'].position} rotation={nodes['picture1'].rotation}>
			<SplineMesh node={nodes['pictureFrame1']}>
				<MeshPhongWithCssColor color="color-bg-2" />
			</SplineMesh>
			<SplineMesh node={nodes['canvas1']} />
		</T.Group>

		<T.Group position={nodes['picture2'].position} rotation={nodes['picture2'].rotation}>
			<SplineMesh node={nodes['pictureFrame2']}>
				<MeshPhongWithCssColor color="color-bg-2" />
			</SplineMesh>
			<SplineMesh node={nodes['canvas2']} />
		</T.Group>

		<!-- Exercise Area -->
		<SplineMesh node={nodes['exerciseMat']} />
		<SplineGroupAndMeshChildren node={nodes['dumbbell1']} />
		<SplineGroupAndMeshChildren node={nodes['dumbbell2']} />
		<!-- <SplineGroupAndMeshChildren node={nodes['gym_bag']} /> -->

		<!-- Shelves -->
		<SplineMesh node={nodes['shelf1']}>
			<MeshPhongWithCssColor color="color-copy-2" />
		</SplineMesh>
		<SplineMesh node={nodes['shelf2']}>
			<MeshPhongWithCssColor color="color-copy-2" />
		</SplineMesh>

		<!-- Camera -->
		<SplineGroupAndMeshChildren node={nodes['camera']} />
		<SplineGroupAndMeshChildren node={nodes['lens']} />
		<SplineGroupAndMeshChildren node={nodes['lens2']} />
		<SplineGroupAndMeshChildren node={nodes['sdCard']} />
		<SplineGroupAndMeshChildren node={nodes['sdCard2']} />
		<SplineGroupAndMeshChildren node={nodes['cameraBatteries']} />

		<!-- Journals -->
		<SplineGroupAndMeshChildren  node={nodes['orangeJournal']}/>
		<SplineGroupAndMeshChildren  node={nodes['blueJournal']}/>
		<SplineGroupAndMeshChildren  node={nodes['blackJournal']}/>
	{/if}
</Canvas>
