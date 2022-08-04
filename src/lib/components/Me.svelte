<script lang="ts">
	export let size = 210;
	let region:
		| 'topleft'
		| 'left'
		| 'bottomleft'
		| 'bottom'
		| 'bottomright'
		| 'right'
		| 'topright'
		| 'top';

	let meElement: HTMLElement;
	const mouseMoveHandler = (e: MouseEvent) => {
		if (!meElement) return;
		const c = {
			x: e.clientX,
			y: e.clientY
		};
		const meElementBounds = meElement.getBoundingClientRect();
		const me = {
			top: meElementBounds.top,
			left: meElementBounds.left,
			right: meElementBounds.right,
			bottom: meElementBounds.bottom
		};

		let _region = '';
		if (c.y < me.top) {
			_region += 'top';
		}
		if (c.y > me.bottom) {
			_region += 'bottom';
		}
		if (c.x < me.left) {
			_region += 'left';
		}
		if (c.x > me.right) {
			_region += 'right';
		}
		region = _region as any;
	};
</script>

<svelte:window on:mousemove={mouseMoveHandler} />

<div class="me {region}" style="--width: {size}px" bind:this={meElement}>
	<div class="window">
		<div class="sun_moon" />
	</div>
	<div class="head" />
	<div class="hair">
		<div class="parting_left" />
		<div class="parting_right" />
	</div>
	<div class="eyebrows">
		<div class="brow_left" />
		<div class="brow_right" />
	</div>
	<div class="eyes">
		<div class="eye_left" />
		<div class="eye_right" />
	</div>
	<div class="monitor" />
</div>

<style lang="scss">
	/**
  Inspired by this codepen https://codepen.io/maaarj/pen/vmYPqm,
  credit goes to Marjo Sobrecaray for the idea.
**/

	$headH: 0.466;
	$headW: 0.42;
	$hairH: 0.232;
	$hairW: 0.512;
	$eyebrowH: 0.018;
	$eyebrowW: 0.42;
	$eyeH: 0.046;
	$eyeW: 0.42;

	$flesh: #ffd3c1;
	$hair: #333;
	$eye: #111427;
	$monitor: #bbb;

	@mixin bodypart($top, $left, $color, $width, $height) {
		position: absolute;
		top: calc(50% + (var(--width) * #{$top}) - (var(--width) * #{$height}) / 2);
		left: calc(50% + (var(--width) * #{$left}) - (var(--width) * #{$width}) / 2);
		width: calc(var(--width) * #{$width});
		height: calc(var(--width) * #{$height});
		background: $color;
		transition: all 0.5s ease;
	}

	@mixin move($x: 0, $y: 0, $deg: 0deg) {
		transform: translate(calc(var(--width) * #{$x}), calc(var(--width) * #{$y})) rotate($deg);
	}

	@mixin relative-border-radius($a, $b, $c, $d) {
		border-radius: calc(var(--width) * #{$a}) calc(var(--width) * #{$b}) calc(var(--width) * #{$c})
			calc(var(--width) * #{$d});
	}

	.me {
		// --width: 210px;
		position: relative;
		width: var(--width);
		height: var(--width);
	}

	// Character

	.head {
		@include bodypart(0, 0, $flesh, $headW, $headH);
		border-radius: calc(var(--width) * #{$headH});
	}
	.hair {
		@include bodypart(-0.2, 0, transparent, $hairW, $hairH);
		display: grid;
		grid-template-columns: 2fr 1.1fr;
		.parting {
			&_left,
			&_right {
				background: $hair;
				position: relative;
				transition: all 0.5s ease;
			}
			&_left {
				@include relative-border-radius(0.186, 0.094, 0.094, 0.056);
				left: calc(var(--width) * 0.024);
			}
			&_right {
				height: calc(var(--width) * 0.2);
				margin-top: auto;
				@include relative-border-radius(0.07, 0.14, 0.07, 0.094);
				right: calc(var(--width) * 0.024);
			}
		}
	}

	.eyebrows {
		@include bodypart(-0.06, 0, transparent, $eyebrowW, $eyebrowH);
		display: flex;
		justify-content: space-around;
		.brow {
			&_left,
			&_right {
				width: calc(var(--width) * 0.116);
				height: calc(var(--width) * #{$eyebrowH});
				background: $hair;
			}
			&_left {
				border-top-left-radius: calc(var(--width) * 0.466);
			}
			&_right {
				border-top-right-radius: calc(var(--width) * 0.466);
			}
		}
	}
	.eyes {
		@include bodypart(0, 0, transparent, $eyeW, $eyeH);
		display: flex;
		justify-content: space-around;
		.eye {
			&_left,
			&_right {
				background: $eye;
				width: calc(var(--width) * #{$eyeH});
				height: calc(var(--width) * #{$eyeH});
				border-radius: 50%;
				margin: auto;
				animation: blink 4.5s ease infinite;
			}
		}
	}
	@keyframes blink {
		0% {
			height: calc(var(--width) * #{$eyeH});
		}
		95% {
			height: calc(var(--width) * #{$eyeH});
		}
		97.5% {
			height: calc(var(--width) * 0.01);
		}
		100% {
			height: calc(var(--width) * #{$eyeH});
		}
	}

	.monitor {
		// not really bodypart but we'll use it anyway
		@include bodypart(0.303, 0, $monitor, 0.606, 0.374);
		border-radius: calc(var(--width) * 0.046);
		box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.5);
		animation: rainbow 5s ease infinite reverse;
	}

	.window {
		@include bodypart(0, 0, var(--color-bg-2), 0.933, 0.933);
		z-index: 0;
		background-image: linear-gradient(
				transparent 0%,
				transparent 49%,
				var(--color-copy-2) 49%,
				var(--color-copy-2) 51%,
				transparent 51%,
				transparent 100%
			),
			linear-gradient(
				90deg,
				transparent 0%,
				transparent 49%,
				var(--color-copy-2) 49%,
				var(--color-copy-2) 51%,
				transparent 51%,
				transparent 100%
			);
		// border-radius: calc(var(--width) * 0.046);
		border-radius: 50%;
		border: calc(var(--width) * 0.024) solid var(--color-copy-2);
		// overflow: hidden;
		// .sun_moon {
		// 	@include bodypart(-0.167, -0.3, transparent, 0.167, 0.167);
		// 	border-radius: 50%;
		// 	transform: rotate(-20deg);
		// 	box-shadow: white calc(var(--width) * 0.07) 0px inset,
		// 		white calc(var(--width) * 0.07) 0px 1px 2px inset;
		// }
	}

	@keyframes rainbow {
		0% {
			box-shadow: 0px 0px calc(var(--width) * 0.07) rgba(255, 255, 255, 0.2);
		}
		25% {
			box-shadow: 0px 0px calc(var(--width) * 0.07) rgba(0, 255, 0, 0.2);
		}
		50% {
			box-shadow: 0px 0px calc(var(--width) * 0.07) rgba(255, 238, 0, 0.2);
		}
		75% {
			box-shadow: 0px 0px calc(var(--width) * 0.07) rgba(0, 255, 255, 0.2);
		}
		100% {
			box-shadow: 0px 0px calc(var(--width) * 0.07) rgba(255, 255, 255, 0.2);
		}
	}

	// Regional Classes

	.me.topleft {
		.head {
			@include move(-0.046, -0.046, 15deg);
		}
		.hair {
			@include move(-0.024, -0.046, 15deg);
			width: calc(var(--width) * (#{$hairW} + 0.024));
			height: calc(var(--width) * (#{$hairH} - 0.024));
			.parting {
				&_right {
					height: calc(var(--width) * 0.178);
				}
			}
		}
		.eyes {
			@include move(-0.07, -0.07, 15deg);
		}
		.eyebrows {
			@include move(-0.056, -0.066, 15deg);
		}
		.monitor {
			transform: rotateX(-15deg);
			transform-origin: bottom;
		}
	}
	.me.left {
		.head {
			@include move(-0.046, 0);
		}
		.hair {
			@include move(-0.056, 0);
		}
		.eyes {
			@include move(-0.07, 0);
		}
		.eyebrows {
			@include move(-0.08, 0);
		}
	}
	.me.bottomleft {
		.head {
			@include move(-0.046, 0.046, -0deg);
		}
		.hair {
			@include move(-0.084, 0, -5deg);
			width: calc(var(--width) * (#{$hairW} + 0.024));
			height: calc(var(--width) * (#{$hairH} + 0.024));
			.parting {
				&_right {
					height: calc(var(--width) * 0.224);
				}
			}
		}
		.eyes {
			@include move(-0.08, 0.024, -7deg);
		}
		.eyebrows {
			@include move(-0.094, 0.024, -7deg);
		}
		.monitor {
			transform: rotateX(20deg);
			transform-origin: bottom;
		}
	}
	.me.bottom {
		.head {
			@include move(0, 0.056);
		}
		.hair {
			@include move(0, 0);
			height: calc(var(--width) * (#{$hairH} + 0.046));
			.parting {
				&_right {
					height: calc(var(--width) * 0.248);
				}
			}
		}
		.eyes {
			@include move(0, 0.046);
		}
		.eyebrows {
			@include move(0, 0.046);
		}
		.monitor {
			transform: rotateX(25deg);
			transform-origin: bottom;
		}
	}
	.me.bottomright {
		.head {
			@include move(0.046, 0.046, -0deg);
		}
		.hair {
			@include move(0.07, 0, 5deg);
			width: calc(var(--width) * (#{$hairW} + 0.024));
			height: calc(var(--width) * (#{$hairH} + 0.024));
			.parting {
				&_right {
					height: calc(var(--width) * 0.224);
				}
			}
		}
		.eyes {
			@include move(0.08, 0.024, 7deg);
		}
		.eyebrows {
			@include move(0.094, 0.024, 7deg);
		}
		.monitor {
			transform: rotateX(20deg);
			transform-origin: bottom;
		}
	}
	.me.right {
		.head {
			@include move(0.046, 0);
		}
		.hair {
			@include move(0.056, 0);
		}
		.eyes {
			@include move(0.07, 0);
		}
		.eyebrows {
			@include move(0.08, 0);
		}
	}
	.me.topright {
		.head {
			@include move(0.046, -0.046, -15deg);
		}
		.hair {
			@include move(0, -0.046, -15deg);
			width: calc(var(--width) * (#{$hairW} + 0.024));
			height: calc(var(--width) * (#{$hairH} - 0.024));
			.parting {
				&_right {
					height: calc(var(--width) * 0.178);
				}
			}
		}
		.eyes {
			@include move(0.07, -0.07, -15deg);
		}
		.eyebrows {
			@include move(0.056, -0.066, -15deg);
		}
		.monitor {
			transform: rotateX(-15deg);
			transform-origin: bottom;
		}
	}
	.me.top {
		.head {
			@include move(0, -0.056);
		}
		.hair {
			@include move(0, -0.056);
			height: calc(var(--width) * (#{$hairH} - 0.024));
			.parting {
				&_right {
					height: calc(var(--width) * 0.178);
				}
			}
		}
		.eyes {
			@include move(0, -0.094);
		}
		.eyebrows {
			@include move(0, -0.084);
		}
	}
</style>
