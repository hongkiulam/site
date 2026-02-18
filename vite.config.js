import { sveltekit } from '@sveltejs/kit/vite';
import { threlteSplineTypesPlugin } from 'threlte-spline/dist/types-plugin';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), threlteSplineTypesPlugin()],
  ssr: {
    noExternal: ['three', 'throija-three-text']
  }
};

export default config;
