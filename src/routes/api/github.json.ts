import { variables } from '$lib/variables';
import type { EnhancedGithubRepo, GithubRepo } from '$types/github';
import * as NodeHtmlParser from 'node-html-parser';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
	const url = 'https://api.github.com/users/hongkiulam/repos?sort=updated';

	try {
		const reposRes = await fetch(url, {
			headers: {
				Authorization: 'token ' + variables.github_token
			}
		});

		if (!reposRes.ok) {
			return { status: reposRes.status };
		}

		const repos: GithubRepo[] = await reposRes.json();

		// get languages for each repo
		const repoLanguagePromises = repos.map(
			(repo) =>
				fetch(repo.languages_url, {
					headers: {
						Authorization: 'token ' + variables.github_token
					}
				}) as Promise<Response>
		);

		const languagesRes = await Promise.all(repoLanguagePromises);
		const languages = await Promise.all(
			languagesRes.map((res) => {
				if (res.ok) {
					return res.json();
				} else {
					return {};
				}
			})
		);

		// get pinned repos
		const githubPageRes = await fetch('https://github.com/hongkiulam');
		const githubPage = githubPageRes.ok ? await githubPageRes.text() : '';

		const root = NodeHtmlParser.parse(githubPage);
		const pinnedRepos = root.querySelectorAll('.pinned-item-list-item-content span.repo');
		const pinnedRepoNames = pinnedRepos.map((x) => x.textContent);

		const enhancedGithubRepos: EnhancedGithubRepo[] = repos
			.map(
				(repo, index): EnhancedGithubRepo => ({
					...repo,
					languages: Object.keys(languages[index]),
					pinned: pinnedRepoNames.includes(repo.name)
				})
			)
			.filter((repo) => !repo.fork) // remove forks
			.sort((a, b) => {
				if (a.pinned === b.pinned) return 0; // keep same order
				return b.pinned ? 1 : -1; // move pinned items to the start
			});

		return {
			body: enhancedGithubRepos,
			status: 200
		};
	} catch {
		return { status: 500 };
	}
}
