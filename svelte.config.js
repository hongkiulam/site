import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import postcssCustomMedia from 'postcss-custom-media';
import seqPreprocessor from 'svelte-sequential-preprocessor';
import { preprocessThrelte } from '@threlte/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: seqPreprocessor([
		preprocess({
			postcss: {
				plugins: [postcssCustomMedia({ importFrom: ['src/lib/styles/custom-media.css'] })]
			}
		}),
		preprocessThrelte()
	]),

	kit: {
		adapter: adapter(),
		alias: {
			'$types/*': 'src/types/*'
		}
	}
};

export default config;
