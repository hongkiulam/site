import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import postcssCustomMedia from 'postcss-custom-media';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: {
			plugins: [postcssCustomMedia({ importFrom: ['src/lib/styles/custom-media.css'] })]
		}
	}),

	kit: {
		adapter: adapter()
	}
};

export default config;
