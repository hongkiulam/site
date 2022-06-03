import getBehanceStore from './get-behance-store';
import type { InternalBehanceProject } from '../../types/behance';

export default async (params: {
	id: number;
	slug: string;
}): Promise<InternalBehanceProject['images']> => {
	const projectPath = params.id + '/' + params.slug;
	const pageStore = await getBehanceStore(`https://behance.net/gallery/${projectPath}`);
	const projectModules = pageStore.project.project.modules;
	const imageModules = projectModules.filter((mod) =>
		['image', 'media_collection'].includes(mod.type)
	);
	const imageUrls: InternalBehanceProject['images'] = [];
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
