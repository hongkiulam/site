import { dev } from '$app/environment';
import type { BehanceProfileProject } from '$types/behance';
import { projects as projectsMockData } from '$lib/mocks/photos';

export const load = async ({ fetch }) => {
  let projects: BehanceProfileProject[] = [];
  if (!dev) {
    projects = projectsMockData;
  } else {
    const res = await fetch('/api/behance/all-graphql');

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
