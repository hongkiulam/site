// workaround for environment variables https://timdeschryver.dev/blog/environment-variables-with-sveltekit
export const variables = {
	github_token: import.meta.env.VITE_GITHUB_TOKEN,
	firebase_bucket_name: import.meta.env.VITE_FIREBASE_BUCKET_NAME as string,
	firebase_service_account: {
		client_email: import.meta.env.VITE_FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL as string,
		project_id: import.meta.env.VITE_FIREBASE_SERVICE_ACCOUNT_PROJECT_ID as string,
		private_key: import.meta.env.VITE_FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY as string
	}
};
