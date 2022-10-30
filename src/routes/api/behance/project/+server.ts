import getProjectImages from '$lib/utils/get-project-images';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const params = url.searchParams;
	const projectId = params.get('projectId');
	const projectSlug = params.get('projectSlug');
	if (!projectId) {
    return error(400,'?projectId not supplied')
	}
	const imageUrls = await getProjectImages({
		id: Number(projectId),
		slug: projectSlug || undefined
	});

  return json(imageUrls)
};
