<article>
	<slot />
</article>

<style lang="scss">
	article {
		display: flex;
		color: var(--color-copy-2);
		background: var(--color-bg-2);
		border: 2px solid transparent;
		border-radius: var(--space);
		&:hover {
			border-color: var(--color-primary-accent);
		}
	}
</style>
