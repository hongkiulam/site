import getBehanceStore from '$lib/utils/get-behance-store';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	const projectId = query.get('projectId');
	const projectSlug = query.get('projectSlug');
	if (!projectId || !projectSlug) {
		return { status: 400, error: '?projectId and ?projectSlug not supplied' };
	}
	const projectPath = projectId + '/' + projectSlug;
	const pageStore = await getBehanceStore(`https://behance.net/gallery/${projectPath}`);
	const projectModules = pageStore.project.project.modules;
	const imageModules = projectModules.filter((mod) =>
		['image', 'media_collection'].includes(mod.type)
	);
	const imageUrls = [];
	imageModules.forEach((mod) => {
		if (mod.type === 'image') {
			imageUrls.push(mod.src);
		} else {
			// grid type
			mod.components.forEach((comp) => {
				imageUrls.push(comp.src);
			});
		}
	});

	return {
		body: imageUrls,
		status: 200
	};
}
