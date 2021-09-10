// workaround for environment variables https://timdeschryver.dev/blog/environment-variables-with-sveltekit
export const variables = {
	github_token: import.meta.env.VITE_GITHUB_TOKEN,
};
