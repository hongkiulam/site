import { variables } from '$lib/variables';
import type { EnhancedGithubRepo, GithubRepo } from '$types/github';
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const GET: RequestHandler<Record<string, string>, EnhancedGithubRepo[]> = async () => {
	const url = 'https://api.github.com/users/hongkiulam/repos?sort=updated';

	try {
		const reposRes = await axios(url, {
			headers: {
				Authorization: 'token ' + variables.github_token
			}
		});

		if (reposRes.status !== 200) {
			return { status: reposRes.status };
		}

		const repos: GithubRepo[] = await reposRes.data;

		// get languages for each repo
		const repoLanguagePromises = repos.map((repo) =>
			axios(repo.languages_url, {
				headers: {
					Authorization: 'token ' + variables.github_token
				}
			})
		);

		const languagesRes = await Promise.all(repoLanguagePromises);
		const languages = await Promise.all(
			languagesRes.map((res) => {
				if (res.status === 200) {
					return res.data;
				} else {
					return {};
				}
			})
		);

		// get pinned repos
		// const githubPageRes = await axios('https://github.com/hongkiulam');
		// const githubPage = githubPageRes.status === 200 ? githubPageRes.data : '';

		// const root = NodeHtmlParser.parse(githubPage);
		// const pinnedRepos = root.querySelectorAll('.pinned-item-list-item-content span.repo');
		// const pinnedRepoNames = pinnedRepos.map((x) => x.textContent);

		const enhancedGithubRepos: EnhancedGithubRepo[] = repos
			.map(
				(repo, index): EnhancedGithubRepo => ({
					...repo,
					languages: Object.keys(languages[index]),
					pinned: false /*pinnedRepoNames.includes(repo.name)*/
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
};
