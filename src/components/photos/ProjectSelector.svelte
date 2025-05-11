<script lang="ts">
  import type { SanitisedBehancePhotographyProject } from "@@types/behance";
  import { photosState } from "@components/photos/state/photos-state";

  const { allProjects } = $props() as {
    allProjects: SanitisedBehancePhotographyProject[];
  };
  $effect(() => {
    console.log($photosState);
  });
</script>

<menu
  class="w-full flex items-center justify-center p-4 bg-primary text-primary-foreground"
>
  <select
    onchange={(event) => {
      photosState.setKey(
        "selectedProjectId",
        Number(event.currentTarget.value)
      );
    }}
  >
    {#each allProjects as project}
      <option class="text-foreground" value={project.id}>{project.name}</option>
    {/each}
  </select>
</menu>
