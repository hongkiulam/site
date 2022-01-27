<script lang="ts">
	import type { EnhancedGithubRepo } from '$types/github';
	import { siVisualstudiocode } from 'simple-icons/icons';
	import AppWindow from './AppWindow.svelte';
	import Icon from './Icon.svelte';

	export let repo: EnhancedGithubRepo;
</script>

<AppWindow bind:entity={repo}>
	<iframe src={repo.html_url.replace('github', 'github1s')} title={repo.name} frameborder="0" />
	<div style="display:contents" slot="minimise-icon"><Icon simpleIcon={siVisualstudiocode} /></div>
</AppWindow>

<style>
	iframe {
		width: 100%;
		height: 100%;
	}
</style>
