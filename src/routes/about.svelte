<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>about | haydon lam</title>
</svelte:head>
<section>
	<article>
		<h2>
			👋 hi, i’m haydon! i grew up in birmingham, uk 🇬🇧 and studied product design engineering at
			loughborough. i’m currently living back in birmingham working as a web developer.
		</h2>
	</article>
	<article>
		<h2>❤️ things i link...</h2>
		<ul>
			<li>writing todos</li>
			<li>typing on small keyboards</li>
			<li>buttery scrambled eggs</li>
			<li>buying second hand products</li>
		</ul>
	</article>
	<article>
		<h2>👨‍💻 tech i use...</h2>
		<ul>
			<li>react, svelte (frontend)</li>
			<li>git (version control)</li>
			<li>node.js (backend)</li>
			<li>docker (containerisation)</li>
			<li>mongodb, firestore (database)</li>
			<li>vscode (code editor)</li>
			<li>figma (design)</li>
			<li>pop os (operating system)</li>
		</ul>
	</article>
	<article>
		<h2>📷 photography gear i use...</h2>
		<ul>
			<li>sony alpha a7r (body)</li>
			<li>sony 24-70mm f3.5-5.6, industar-50 50mm f3.5, hoya 28mm f2.8 (lens)</li>
			<li>darktable (raw editor)</li>
		</ul>
	</article>
	<article>
		<h2>🦉 find me...</h2>
		<ul>
			<li><a href="https://github.com/hongkiulam" target="_blank">github</a></li>
			<li><a href="https://linkedin.com/in/haydonlam" target="_blank">linkedin</a></li>
			<li><a href="https://instagr.am/haydonlam" target="_blank">instagram</a></li>
			<li><a href="https://behance.net/haydonlam" target="_blank">behance</a></li>
			<li><a href="mailto:lamhaydon@gmail.com" target="_blank">email</a></li>
		</ul>
	</article>
</section>

<style>
	section {
		max-width: calc(var(--space-xxl) * 20);
	}
	article + article {
		margin-top: var(--space-l);
	}
	ul {
		margin-left: var(--space-l);
	}
</style>
