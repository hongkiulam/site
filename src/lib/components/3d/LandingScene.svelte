<script lang="ts">
	import { buildGraph } from '$lib/utils/threlte';
	import { Canvas, OrbitControls, T, useLoader } from '@threlte/core';
	import { useCursor } from '@threlte/extras';
	import { degToRad } from 'three/src/math/MathUtils';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import MeshPhongWithCssColor from './MeshPhongWithCSSColor.svelte';
	import SplineMesh from './SplineMesh.svelte';
	import RectAreaLight from './RectAreaLight.svelte';
	import SplineGroupAndMeshChildren from './SplineGroupAndMeshChildren.svelte';
	import SplineGroup from './SplineGroup.svelte';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();
	const { onPointerEnter, onPointerLeave } = useCursor();
	let splineDataLoaded = false;
	let nodes: ReturnType<typeof buildGraph>['nodes'];
	let materials: ReturnType<typeof buildGraph>['materials'];

	onMount(async () => {
		const splineloader = await import('@splinetool/loader').then((mod) => mod.default);
		const loader = useLoader(splineloader, () => new splineloader());
		loader.load(
			`https://prod.spline.design/ZHtnxBIvBXpuWgue/scene.splinecode?t=${Date.now()}`,
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

	const isMobile = typeof window !== 'undefined' ? 'ontouchstart' in window : false;
	type Links = '/photos' | '/code' | '/about';
	const preObjectActionEventName = 'pre-object-action';
	let mobileAutoDismissTimeout: number;
	const hoverOverObject = (href: Links, hovered: boolean) => {
		// disable on mobile
		if (isMobile) return;
		(hovered ? onPointerEnter : onPointerLeave)();
		dispatch(preObjectActionEventName, hovered ? href : '');
	};
	const clickObject = (href: Links) => {
		if (isMobile) {
			// prompt the toast to appear on mobile
			dispatch(preObjectActionEventName, href);
			window.clearTimeout(mobileAutoDismissTimeout);
			mobileAutoDismissTimeout = window.setTimeout(() => {
				dispatch(preObjectActionEventName, '');
			}, 6000);
		} else {
			goto(href);
		}
	};

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.clearTimeout(mobileAutoDismissTimeout);
		}
	});
</script>

<!-- Spline uses linear encoding for colours, this sets ctx.renderer.outputEncoding = LinearEncoding so
that colors and lighting are aligned with what is in spline -->
<!-- Rationale for flat https://github.com/pmndrs/react-three-fiber/discussions/1290 -->
<Canvas linear flat>
	{#if splineDataLoaded}
		<T.PerspectiveCamera
			makeDefault
			position={nodes.sceneCamera.position}
			fov={nodes.sceneCamera.fov}
			zoom={window.innerWidth < 900 ? 0.5 : nodes.sceneCamera.zoom}
		>
			<!-- min|maxZoom for OrthographicCamera -->
			<!-- min|maxDistance for PerspectiveCamera -->
			<OrbitControls
				maxPolarAngle={degToRad(97)}
				minPolarAngle={degToRad(70)}
				minAzimuthAngle={degToRad(-20)}
				maxAzimuthAngle={degToRad(20)}
				minDistance={50}
				maxDistance={175}
				enableZoom
				enablePan={true}
				enableDamping
				rotateSpeed={0.5}
			/>
		</T.PerspectiveCamera>

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
		<SplineMesh node={nodes['baseWall']}>
			<MeshPhongWithCssColor color="color-bg-1" />
		</SplineMesh>
		<SplineMesh node={nodes['backWall']}>
			<MeshPhongWithCssColor color="color-bg-1" />
		</SplineMesh>

		<!-- Computer Parts -->
		<SplineGroup node={nodes['mac']}>
			{#each nodes['mac'].children as child}
				{#if child.name !== 'macImage'}
					<SplineMesh node={child} />
				{:else}
					<SplineMesh
						node={child}
						interactive
						on:click={() => clickObject('/code')}
						on:hover={(e) => hoverOverObject('/code', e.detail)}
					/>
				{/if}
			{/each}
		</SplineGroup>
		<SplineGroupAndMeshChildren node={nodes['keyboard']} />

		<SplineGroup node={nodes['monitor']}>
			<SplineMesh node={nodes['monitorFrame']}>
				<MeshPhongWithCssColor color="color-copy-2" />
			</SplineMesh>
			<SplineMesh node={nodes['monitorArm']}>
				<MeshPhongWithCssColor color="color-copy-2" />
			</SplineMesh>
			<SplineMesh node={nodes['monitorScreen']} />
		</SplineGroup>

		<SplineGroupAndMeshChildren node={nodes['mouse']} />

		<!-- Picture Objects -->
		<SplineGroup node={nodes['picture1']}>
			<SplineMesh
				node={nodes['canvas1']}
				interactive
				on:click={() => clickObject('/photos')}
				on:hover={(e) => hoverOverObject('/photos', e.detail)}
			/>
		</SplineGroup>

		<SplineGroup node={nodes['picture2']}>
			<SplineMesh
				node={nodes['canvas2']}
				interactive
				on:click={() => clickObject('/photos')}
				on:hover={(e) => hoverOverObject('/photos', e.detail)}
			/>
		</SplineGroup>

		<!-- Camera -->
		<SplineGroupAndMeshChildren node={nodes['camera']} />
		<SplineGroupAndMeshChildren node={nodes['lens']} />
		<SplineGroupAndMeshChildren node={nodes['lens2']} />
		<SplineGroupAndMeshChildren node={nodes['sdCard']} />
		<SplineGroupAndMeshChildren node={nodes['sdCard2']} />
		<SplineGroupAndMeshChildren node={nodes['cameraBatteries']} />

		<!-- Journals -->
		<SplineGroup node={nodes['orangeJournal']}>
			<SplineMesh
				node={nodes['orangeJournalBack']}
				interactive
				on:click={() => clickObject('/about')}
				on:hover={(e) => hoverOverObject('/about', e.detail)}
			/>
			<SplineMesh
				node={nodes['orangeJournalPaper']}
				interactive
				on:click={() => clickObject('/about')}
				on:hover={(e) => hoverOverObject('/about', e.detail)}
			/>
		</SplineGroup>
		<SplineGroup node={nodes['blackJournal']}>
			<SplineMesh
				node={nodes['blackJournalBack']}
				interactive
				on:click={() => clickObject('/about')}
				on:hover={(e) => hoverOverObject('/about', e.detail)}
			/>
			<SplineMesh
				node={nodes['blackJournalPaper']}
				interactive
				on:click={() => clickObject('/about')}
				on:hover={(e) => hoverOverObject('/about', e.detail)}
			/>
		</SplineGroup>
		<SplineGroup node={nodes['blueJournal']}>
			<SplineMesh
				node={nodes['blueJournalBack']}
				interactive
				on:click={() => clickObject('/about')}
				on:hover={(e) => hoverOverObject('/about', e.detail)}
			/>
			<SplineMesh
				node={nodes['blueJournalPaper']}
				interactive
				on:click={() => clickObject('/about')}
				on:hover={(e) => hoverOverObject('/about', e.detail)}
			/>
		</SplineGroup>

		<!-- Arrows -->
		<SplineGroupAndMeshChildren node={nodes['pointerPicture1']} />
		<SplineGroupAndMeshChildren node={nodes['pointerPicture2']} />
		<SplineGroupAndMeshChildren node={nodes['pointerMac']} />
		<SplineGroupAndMeshChildren node={nodes['pointerJournal']} />
	{/if}
</Canvas>
