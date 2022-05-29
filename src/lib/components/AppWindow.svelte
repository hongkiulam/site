<script lang="ts">
	import { onDestroy } from 'svelte';

	export let entity: { id: number | string; name: string } | undefined;

	let prevEntity = entity;
	let minimised: boolean = false;
	let appWindowEl: HTMLElement;
	let fullscreen: boolean = false;
	let needsCentering: boolean = true;

	const startDraggingElement = (e: MouseEvent) => {
		let currentX = 0,
			currentY = 0,
			startX = 0,
			startY = 0;

		appWindowEl.classList.add('dragging');

		const _drag = (e: MouseEvent) => {
			currentX = startX - e.clientX;
			currentY = startY - e.clientY;
			startX = e.clientX;
			startY = e.clientY;
			appWindowEl.style.top = `${appWindowEl.offsetTop - currentY}px`;
			appWindowEl.style.left = `${appWindowEl.offsetLeft - currentX}px`;
		};
		const _stopDragging = (e: MouseEvent) => {
			document.removeEventListener('mouseup', _stopDragging);
			document.removeEventListener('mousemove', _drag);
			const endLeft = appWindowEl.getBoundingClientRect().left;
			const endRight = appWindowEl.getBoundingClientRect().right;
			const endY = appWindowEl.getBoundingClientRect().top;
			if (endY < 0 || endY > window.innerHeight) {
				appWindowEl.style.top = '50%';
			}
			if (endRight < 0 || endLeft > window.innerWidth) {
				appWindowEl.style.left = '50%';
			}
			appWindowEl.classList.remove('dragging');
		};

		startX = e.clientX;
		startY = e.clientY;
		document.addEventListener('mousemove', _drag);
		document.addEventListener('mouseup', _stopDragging);
	};

	$: show = !!entity;

	$: isVisible = show && !minimised;
	$: if (isVisible && needsCentering && appWindowEl) {
		const { width, height } = appWindowEl.getBoundingClientRect();
		appWindowEl.style.top = `${window.innerHeight / 2 - height / 2}px`;
		appWindowEl.style.left = `${window.innerWidth / 2 - width / 2}px`;
		needsCentering = false;
	}
	$: if (!isVisible) {
		needsCentering = true;
	}

	$: document.documentElement.classList[isVisible ? 'add' : 'remove']('noscroll');

	$: if (entity?.id !== prevEntity?.id) {
		minimised = false;
		prevEntity = entity;
	}
	onDestroy(() => {
		document.documentElement.classList.remove('noscroll');
	});
</script>

{#if show && !minimised}
	<div class="app-window" class:fullscreen bind:this={appWindowEl}>
		<div class="title-bar" on:mousedown={startDraggingElement}>
			<div class="buttons">
				<button class="close" on:click={() => (entity = undefined)} />
				<button class="minimise" on:click={() => (minimised = true)} />
				<button class="maximise" on:click={() => (fullscreen = !fullscreen)} />
			</div>
			<p class="title">{entity.name || ''}</p>
		</div>
		<div class="content"><slot /></div>
	</div>
{/if}
{#if minimised}
	<aside on:click={() => (minimised = false)}>
		<slot name="minimise-icon" />{entity.name || ''}
	</aside>
{/if}

<style lang="scss">
	$appWindowWidth: 1100px;
	.app-window {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 50%;
		left: 50%;
		width: calc(100% - var(--space-l));
		height: calc(100% - var(--space-l));
		max-width: $appWindowWidth;
		max-height: calc(#{$appWindowWidth} * 2 / 3);
		background: var(--bg-2);
		border-radius: var(--space);
		overflow: hidden;
		box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
		z-index: 1;
		&.fullscreen {
			max-width: initial;
			max-height: initial;
			top: var(--space) !important;
			left: var(--space) !important;
		}
		&:global(.dragging .content) {
			pointer-events: none;
		}
	}
	.title-bar {
		background: var(--light-2);
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		box-shadow: 0px 2px var(--dark-2);
		height: var(--space-l);
		cursor: grab;
		&:active {
			cursor: grabbing;
		}
		.buttons {
			height: var(--space-l);
			padding: var(--space-s);
			display: flex;
		}
		button {
			width: var(--space);
			height: var(--space);
			border-radius: var(--space);
			opacity: 0.5;
			&:hover {
				opacity: 1;
			}
			&.close {
				background: #d84545;
			}
			&.minimise {
				background: #d89d45;
			}
			&.maximise {
				background: #43b81a;
			}
			& + button {
				margin-left: var(--space-s);
			}
		}
		.title {
			text-align: center;
			color: var(--dark-2);
		}
	}
	.content {
		flex: 1;
		overflow: auto;
	}

	aside {
		display: grid;
		align-items: center;
		grid-auto-flow: column;
		gap: var(--space);
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		background: var(--bg-2);
		padding: var(--space);
		width: calc(var(--space-l) * 10);
		border-radius: var(--space) var(--space) 0 0;
		opacity: 0.8;
		cursor: pointer;
		border: 2px solid var(--bg-1);
		z-index: 1;
		&:hover {
			opacity: 1;
		}
	}
</style>
