/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get() {
	try {
		const aboutMarkdownReq = await fetch(
			'https://storage.googleapis.com/site-91c4c.appspot.com/about.md'
		);
		const aboutMarkdown = await aboutMarkdownReq.text();

		return {
			body: aboutMarkdown,
			status: 200,
			headers: { 'content-type': 'text/markdown' }
		};
	} catch (err) {
		return { status: 500 };
	}
}
