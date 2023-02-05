<script lang="ts">
	import { Menu, Moon, Sun } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import tooltip from '$lib/utils/tooltip';
	import { darkMode } from '$lib/utils/dark-mode';

	let mobileshow = false;

	const closeMobileMenu = () => (mobileshow = false);

	const navRoutes = [
		{ href: '/code', label: 'code' },
		{ href: '/photos', label: 'photos' },
		{ href: '/about', label: 'about' }
	];

	$: if (browser) {
		const tokensToDisable = document?.getElementById(
			`${$darkMode ? 'light' : 'dark'}-design-tokens`
		);
		const tokensToEnable = document?.getElementById(
			`${$darkMode ? 'dark' : 'light'}-design-tokens`
		);
		tokensToDisable?.setAttribute('media', 'none');
		tokensToEnable?.setAttribute('media', 'all');
	}

	</script>

<nav>
	<a href="/"><h2>haydon lam</h2></a>
	<menu class:mobileshow>
		<button
			class="theme-toggle"
			on:click={() => {
				$darkMode = !$darkMode;
			}}
			use:tooltip={{ message: `Toggle theme`, position: 'left' }}
		>
			{#if $darkMode}
				<Sun />
			{:else}
				<Moon />
			{/if}
		</button>
		{#each navRoutes as route}
			<a
				class:active={$page.url.pathname === route.href}
				href={route.href}
				on:click={closeMobileMenu}><h2>{route.label}</h2></a
			>
		{/each}
		<button class="menu-close" on:click={closeMobileMenu}><h2>close</h2></button>
	</menu>
	<button
		class="menu-open"
		on:click={() => {
			mobileshow = true;
		}}
	>
		<Menu />
	</button>
</nav>

<style lang="scss">
	:global(:root) {
		--nav-height: var(--spacing-8);
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--nav-height);
	}

	menu {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		gap: var(--spacing-6);
		a.active {
			color: var(--color-primary-accent);
		}
	}

	.theme-toggle {
		line-height: 0px;
	}

	.menu-open {
		display: none;
		line-height: 0px;
	}
	.menu-close {
		display: none;
		color: var(--color-copy-1);
		&:hover {
			color: var(--color-primary-accent);
		}
	}

	.theme-toggle,
	.menu-open {
		color: var(--color-copy-1);
	}
	.theme-toggle:hover,
	.menu-open:hover {
		color: var(--color-primary-accent);
	}
	@media (--breakpoints-sm-max) {
		menu {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			padding: var(--spacing-2);
			gap: var(--spacing-2);
			grid-auto-flow: row;
			place-items: center;
			background: var(--color-bg-1);
			border-bottom: 2px solid var(--color-copy-1);
			z-index: 2;
			animation: mobile-menu-in 0.2s;
			&.mobileshow {
				display: grid;
			}
			@keyframes mobile-menu-in {
				from {
					transform: translateY(calc(-1 * var(--spacing-6)));
				}
			}
		}
		.menu-open,
		.menu-close {
			display: block;
		}
	}
</style>
