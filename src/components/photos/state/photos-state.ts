import { atom } from 'nanostores';
import { onMount } from 'svelte';

// Create the atom with initial empty state
export const projectSlugState = atom<string>('');

// Helper to sync from URL to store
// export function syncFromURL() {
//   const url = new URL(window.location.href);
//   const projectSlug = url.searchParams.get('projectSlug') || '';
//   $projectSlug.set(projectSlug);
// }

// // Helper to sync from store to URL
// export function syncToURL(slug: string) {
//   const url = new URL(window.location.href);

//   if (slug) {
//     url.searchParams.set('projectSlug', slug);
//   } else {
//     url.searchParams.delete('projectSlug');
//   }

//   // Update URL without page reload
//   window.history.replaceState({}, '', url.toString());
// }

// // Subscribe to store changes and update URL
// $projectSlug.listen((slug) => {
//   // Only run in browser environments
//   if (typeof window !== 'undefined') {
//     syncToURL(slug);
//   }
// });

// // Setup function to initialize store from URL and listen for navigation events
// export function setupProjectStore() {
//   if (typeof window === 'undefined') return;

//   // Initial sync from URL on mount
//   syncFromURL();

//   // Listen for popstate events (browser back/forward navigation)
//   window.addEventListener('popstate', syncFromURL);

//   // Clean up function for component unmount
//   return () => {
//     window.removeEventListener('popstate', syncFromURL);
//   };
// }

// // For use in Svelte components
// export function useProjectStore() {
//   onMount(() => {
//     return setupProjectStore();
//   });
// }

// // Setter function for projectSlug
// export function setProjectSlug(slug: string) {
//   $projectSlug.set(slug);
// }
