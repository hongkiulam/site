<script context="module">
	export const prerender = true;
</script>

<h2>📅 career timeline...</h2>
<dl>
	<dt>now</dt>
	<dd>learning 🧑‍🎓 and earning 💸</dd>
</dl>
<dl>
	<dt>2022</dt>
	<dd>
		<p><strong>apr</strong> - joined laced as a frontend software engineer</p>
		<p><strong>apr</strong> - left simwood</p>
	</dd>
</dl>
<dl><dt>2021</dt></dl>
<dl>
	<dt>2020</dt>
	<dd><strong>jan</strong> - joined simwood as a web developer</dd>
</dl>
<dl>
	<dt>2019</dt>
	<dd>
		<p><strong>aug</strong> - started relearning html, css and js from udemy and youtube</p>
		<p>
			<strong>jul</strong> - graduated from loughborough university with a 2:1 in product design engineering
		</p>
	</dd>
</dl>

<style>
	h2 {
		margin-bottom: var(--spacing-3);
	}
	dl {
		--dot-width: 0.75em;
		border-left: 2px solid var(--color-copy-2);
		padding-left: var(--spacing-3);
		margin-left: var(--dot-width);
	}

	/* for the top section in the timeline, hide the top part of the border above the dot
  by placing this background coloured block over it */
	dl:first-of-type dt::before {
		position: absolute;
		content: '';
		display: block;
		background: var(--color-bg-1);
		width: 1em;
		height: 1em;
		/* move left dl padding, half of this elements width, half of dl border thickness */
		left: calc(-1 * (var(--spacing-3) + 0.5em + 1px));
	}

	/* dot */
	dt::after {
		position: absolute;
		content: '';
		display: block;
		width: var(--dot-width);
		height: var(--dot-width);
		top: 50%;
		transform: translateY(-50%);
		/* move left dl padding, half of this elements width, half of dl border thickness */
		left: calc(-1 * (var(--spacing-3) + (0.5 * var(--dot-width)) + 1px));
		background: var(--color-copy-2);
		border-radius: 50%;
	}
	dt {
		font-size: 1.5em;
		position: relative;
	}
	dd {
		margin-left: var(--spacing-0);
	}
</style>
