<script lang="ts">
	import VscodeIcon from 'simple-icons/icons/visualstudiocode.js';
	import type { EnhancedGithubRepo } from '$types/github';
	import AppWindow from './AppWindow.svelte';
	import Icon from './Icon.svelte';

	export let repo: EnhancedGithubRepo;
</script>

<AppWindow bind:entity={repo}>
	<iframe src={repo.html_url.replace('github', 'github1s')} title={repo.name} frameborder="0" />
	<div style="display:contents" slot="minimise-icon"><Icon simpleIcon={VscodeIcon} /></div>
</AppWindow>

<style>
	iframe {
		width: 100%;
		height: 100%;
	}
</style>
