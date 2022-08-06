import getProjectImages from '$lib/utils/get-project-images';
import type { PictureSource } from '$types/behance';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler<Record<string, string>, Record<number, PictureSource>[]> = async ({
	url
}) => {
	const params = url.searchParams;
	const projectId = params.get('projectId');
	const projectSlug = params.get('projectSlug');
	if (!projectId) {
		return { status: 400, error: '?projectId not supplied' };
	}
	const imageUrls = await getProjectImages({
		id: Number(projectId),
		slug: projectSlug || undefined
	});

	return {
		body: imageUrls,
		status: 200
	};
};
