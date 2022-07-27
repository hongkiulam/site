<script lang="ts">
	import { page } from '$app/stores';

	import SunIcon from 'svelte-feather-icons/src/icons/SunIcon.svelte';
	import MoonIcon from 'svelte-feather-icons/src/icons/MoonIcon.svelte';
	import MenuIcon from 'svelte-feather-icons/src/icons/MenuIcon.svelte';
	import Icon from './Icon.svelte';
	import tooltip from '$lib/utils/tooltip';

	let isDarkTheme = true;
	let mobileshow = false;

	const closeMobileMenu = () => (mobileshow = false);

	const navRoutes = [
		{ href: '/code', label: 'code' },
		{ href: '/photos', label: 'photos' },
		{ href: '/about', label: 'about' }
	];
</script>

<nav>
	<a href="/"><h2>haydon lam</h2></a>
	<menu class:mobileshow>
		<button
			class="theme-toggle"
			on:click={() => {
				document.body.classList.toggle('light');
				isDarkTheme = !isDarkTheme;
			}}
			use:tooltip={{ message: `Toggle theme`, position: 'left' }}
		>
			<Icon featherIcon={isDarkTheme ? SunIcon : MoonIcon} hoverColor="var(--primary)" />
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
		<Icon featherIcon={MenuIcon} hoverColor="var(--primary)" />
	</button>
</nav>

<style lang="scss">
	nav {
		height: var(--space-xxxl);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	menu {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		gap: var(--space-l);
		a.active {
			color: var(--primary);
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
		color: var(--copy-1);
		&:hover {
			color: var(--primary);
		}
	}
	@media only screen and (max-width: 600px) {
		menu {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			padding: var(--space-l);
			grid-auto-flow: row;
			place-items: center;
			background: var(--bg-1);
			border-bottom: 2px solid var(--copy-1);
			z-index: 2;
			animation: mobile-menu-in 0.2s;
			&.mobileshow {
				display: grid;
			}
			@keyframes mobile-menu-in {
				from {
					transform: translateY(calc(-1 * var(--space-xxl)));
				}
			}
		}
		.menu-open,
		.menu-close {
			display: block;
		}
	}
</style>
