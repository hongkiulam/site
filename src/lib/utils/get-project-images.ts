import getBehanceStore from './get-behance-store';
import type {
	InternalBehanceProject,
	PictureSource,
	ProjectModuleImage
} from '../../types/behance';

export default async (params: {
	id: number;
	slug?: string;
}): Promise<InternalBehanceProject['images']> => {
	const projectPath = params.id + '/' + (params.slug || 'randomslug'); // slug doesn't appear to be important
	const pageStore = await getBehanceStore(`https://behance.net/gallery/${projectPath}`);
	const projectModules = pageStore.project.project.modules;
	const imageModules = projectModules.filter((mod) =>
		['image', 'media_collection'].includes(mod.type)
	);
	const imageUrls: InternalBehanceProject['images'] = [];
	const getImageFromBehanceProjectModule = (projMod: ProjectModuleImage) => {
		const pictureSourceArrayAsObject: Record<number, PictureSource> = {};

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
				getImageFromBehanceProjectModule(comp as ProjectModuleImage);
			});
		}
	});
	return imageUrls;
};
