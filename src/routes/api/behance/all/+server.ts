import getBehanceStore from '$lib/utils/get-behance-store';
import getProjectImages from '$lib/utils/get-project-images';
import type { InternalBehanceProject } from '$types/behance';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET:RequestHandler = async () => {
	const behanceEntryUrl = 'https://www.behance.net/gallery/122144979/dummy-project';
	try {
		const behancePageStore = await getBehanceStore(behanceEntryUrl);
		const allProjects = behancePageStore.project.otherProjects;
		const PHOTOGRAPHY_FIELD_ID = 73;
		const photoProjects = allProjects.filter((proj) =>
			proj.fields.some((field) => field.id === PHOTOGRAPHY_FIELD_ID)
		);

		const photoProjectImagesPromises = photoProjects.map((project) => {
			return getProjectImages({ id: project.id, slug: project.slug });
		});

		const photoProjectImages = await Promise.all(photoProjectImagesPromises);

		const photoProjectsWithImages: InternalBehanceProject[] = photoProjects.map(
			(project, index) => {
				return { ...project, images: photoProjectImages[index] };
			}
		);
    return json(photoProjectsWithImages)
	} catch {
    return error(500)
	}
};
