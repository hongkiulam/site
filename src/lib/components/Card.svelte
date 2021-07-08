<article>
	<slot />
</article>

<style lang="scss">
	article {
		display: flex;
		color: var(--copy-2);
		background: var(--bg-2);
		border: 2px solid transparent;
		border-radius: var(--space);
		&:hover {
			border-color: var(--primary);
		}
	}
</style>
