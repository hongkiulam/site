<script lang="ts">
	import SunIcon from 'svelte-feather-icons/src/icons/SunIcon.svelte';
	import MoonIcon from 'svelte-feather-icons/src/icons/MoonIcon.svelte';
	import Icon from './Icon.svelte';

	let isDarkTheme = true;
</script>

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
		gap: var(--space-l);
	}
</style>

<nav>
	<a href="/"><h2>haydon lam</h2></a>
	<menu>
		<button
			on:click={() => {
				document.body.classList.toggle('light');
				isDarkTheme = !isDarkTheme;
			}}
		>
			<Icon featherIcon={isDarkTheme ? SunIcon : MoonIcon} hoverColor="var(--primary)" />
		</button>
		<a href="/code"><h2>code</h2></a>
		<a href="/photos"><h2>photos</h2></a>
		<a href="/about"><h2>about</h2></a>
	</menu>
</nav>
