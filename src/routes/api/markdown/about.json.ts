import { initialiseApp } from '$lib/utils/firebase';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	try {
		const firebase = initialiseApp();
		const aboutMarkdown = await firebase.getMarkdownFromBucket('about.md');
		return {
			body: {
				data: aboutMarkdown
			},
			status: 200
		};
	} catch (err) {
		console.log(err);
		return { status: 500 };
	}
}
