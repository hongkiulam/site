import getBehanceStore from './get-behance-store';

export default async (params: { id: number; slug: string }) => {
	const projectPath = params.id + '/' + params.slug;
	const pageStore = await getBehanceStore(`https://behance.net/gallery/${projectPath}`);
	const projectModules = pageStore.project.project.modules;
	const imageModules = projectModules.filter((mod) =>
		['image', 'media_collection'].includes(mod.type)
	);
	const imageUrls: any[] = [];
	const getImageFromBehanceProjectModule = (projMod) => {
		const pictureSourceArrayAsObject = {};
		
		projMod.picture.sources.forEach((src) => {
			pictureSourceArrayAsObject[src.width] = src;
		});
		imageUrls.push(pictureSourceArrayAsObject);
	};
	imageModules.forEach((mod) => {
		if (mod.type === 'image') {
			getImageFromBehanceProjectModule(mod);
		} else {
			// grid type
			mod.components.forEach((comp) => {
				getImageFromBehanceProjectModule(comp);
			});
		}
	});
	return imageUrls;
};
