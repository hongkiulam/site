import getBehanceStore from '$lib/utils/get-behance-store';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	const behanceEntryUrl = 'https://www.behance.net/gallery/122144979/dummy-project';
	try {
		const behancePageStore = await getBehanceStore(behanceEntryUrl);
		const allProjects = behancePageStore.project.otherProjects;
		const PHOTOGRAPHY_FIELD_ID = 73;
		const photoProjects = allProjects.filter((proj) =>
			proj.fields.some((field) => field.id === PHOTOGRAPHY_FIELD_ID)
		);

		return {
			body: photoProjects,
			status: 200
		};
	} catch {
		return { status: 500 };
	}
}
