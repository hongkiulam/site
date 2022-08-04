<script>
	import autoAnimate from '@formkit/auto-animate';
</script>

<ul use:autoAnimate>
	<slot />
</ul>

<style>
	ul {
		flex: 1 0 250px;
		max-width: 250px;
		margin-right: var(--spacing-3);
		overflow-y: auto;
	}
	ul::-webkit-scrollbar {
		display: none;
	}
	@media only screen and (max-width: 600px) {
		ul {
			max-width: unset;
			flex-basis: 100%;
		}
	}
</style>
