import { dev } from '$app/environment';
import { repos as reposMockData } from '$lib/mocks/code';
import type { EnhancedGithubRepo } from '$types/github';

export const load: import('./$types').PageLoad = async ({ fetch }) => {
	let repos: EnhancedGithubRepo[] = [];
	if (dev) {
		repos = reposMockData;
	} else {
		const res = await fetch('/api/github');

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load github projects`)
			};
		}

		repos = await res.json();
	}
	return { repos };
};
