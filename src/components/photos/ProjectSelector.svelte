<script lang="ts">
  import type { SanitisedBehancePhotographyProject } from '@@types/behance';
  import { projectSlugState } from './state/photos-state';

  const { allProjects  } = $props() as {
    allProjects: SanitisedBehancePhotographyProject[];
  };
</script>

<menu class="w-full flex items-center justify-center p-4 bg-primary text-primary-foreground">
  <select value={$projectSlugState} onchange={event => {
    $projectSlugState = (event.target as HTMLSelectElement).value
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('project', $projectSlugState);
    window.history.replaceState({}, '', `?${searchParams.toString()}`);
  }}>
    {#each allProjects as project}
      <option
        class="text-foreground"
        value={project.slug}
        selected={$projectSlugState === project.slug}>{project.name}</option
      >
    {/each}
  </select>
</menu>
