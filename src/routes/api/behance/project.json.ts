import getProjectImages from '$lib/utils/get-project-images';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ query }) {
	const projectId = query.get('projectId');
	const projectSlug = query.get('projectSlug');
	if (!projectId) {
		return { status: 400, error: '?projectId not supplied' };
	}
	const imageUrls = await getProjectImages({ id: projectId, slug: projectSlug });

	return {
		body: imageUrls,
		status: 200
	};
}
