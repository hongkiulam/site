<section>
	<slot />
</section>

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--space) * 30), 1fr));
		gap: var(--space);
	}
	@media only screen and (max-width: 500px) {
		section {
			grid-template-columns: 1fr;
		}
	}
</style>
