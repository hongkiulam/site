import getBehanceStore from './get-behance-store';

export default async (params: { id: number; slug: string }) => {
	const projectPath = params.id + '/' + params.slug;
	const pageStore = await getBehanceStore(`https://behance.net/gallery/${projectPath}`);
	const projectModules = pageStore.project.project.modules;
	const imageModules = projectModules.filter((mod) =>
		['image', 'media_collection'].includes(mod.type)
	);
	const imageUrls: string[] = [];
	imageModules.forEach((mod) => {
		if (mod.type === 'image') {
			imageUrls.push(mod.sizes['1400']);
		} else {
			// grid type
			mod.components.forEach((comp) => {
				imageUrls.push(comp.sizes['1400']);
			});
		}
	});
	return imageUrls;
};
