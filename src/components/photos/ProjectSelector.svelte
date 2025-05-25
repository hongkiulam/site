<script lang="ts">
  import type { SanitisedBehancePhotographyProject } from '@@types/behance';

  const { allProjects, initialProjectSlug } = $props() as {
    initialProjectSlug: string;
    allProjects: SanitisedBehancePhotographyProject[];
  };

  let selectedProject = $state(initialProjectSlug);

  $effect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('project', selectedProject);
    window.history.replaceState({}, '', `?${searchParams.toString()}`);
  });
</script>

<menu class="w-full flex items-center justify-center p-4 bg-primary text-primary-foreground">
  <select bind:value={selectedProject}>
    {#each allProjects as project}
      <option
        class="text-foreground"
        value={project.slug}
        selected={selectedProject === project.slug}>{project.name}</option
      >
    {/each}
  </select>
</menu>
