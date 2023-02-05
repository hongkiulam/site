import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const darkMode = writable(true);

if (browser) {
	const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	darkMode.set(darkThemeMediaQuery.matches);
	const darkThemeMediaListener = (e: MediaQueryListEvent) => {
		darkMode.set(e.matches);
	};
	darkThemeMediaQuery.addEventListener('change', darkThemeMediaListener);
}
