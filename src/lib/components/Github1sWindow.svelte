<script lang="ts">
	import VscodeIcon from 'simple-icons/icons/visualstudiocode.js';
	import type { EnhancedGithubRepo } from '$types/github';
	import AppWindow from './AppWindow.svelte';
	import Icon from './Icon.svelte';

	export let repo: EnhancedGithubRepo;

	let minimised: boolean = false;

	let prevRepo = repo;
	$: if (repo.id !== prevRepo.id) {
		minimised = false;
		prevRepo = repo;
	}
</script>

<AppWindow
	title={repo?.name}
	show={!!repo}
	{minimised}
	on:minimise={() => {
		minimised = true;
	}}
	on:maximise={() => {
		minimised = false;
	}}
	on:hide={() => {
		repo = undefined;
	}}
>
	<iframe src={repo.html_url.replace('github', 'github1s')} title={repo.name} frameborder="0" />
	<div style="display:contents" slot="minimise-icon"><Icon simpleIcon={VscodeIcon} /></div>
</AppWindow>

<style>
	iframe {
		width: 100%;
		height: 100%;
	}
</style>
