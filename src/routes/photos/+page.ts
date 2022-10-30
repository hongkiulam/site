import { dev } from '$app/environment';
import type { InternalBehanceProject } from '$types/behance';
import type { Load } from '@sveltejs/kit';
import { projects as projectsMockData } from '$lib/mocks/photos';

export const load: Load = async ({ fetch }) => {
	let projects: InternalBehanceProject[] = [];
	if (dev) {
		projects = projectsMockData as any;
	} else {
		const res = await fetch('/api/behance/all');

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load photos`)
			};
		}

		projects = await res.json();
	}
	return { projects };
};

export const prerender = true;
