<script lang="ts">
  import { ExternalLink, Image } from 'lucide-svelte';
  import Masonry from 'svelte-bricks';
  import { beforeNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { BehanceProfileProject } from '$types/behance';
  import BehanceImage from '$lib/components/photos/BehanceImage.svelte';
  import SidebarItem from '$lib/components/shared/SidebarItem.svelte';
  import Sidebar from '$lib/components/shared/Sidebar.svelte';
  import SidebarLayout from '$lib/components/SidebarLayout.svelte';
  import { formatTimestamp, imagesFromAllModules } from '$lib/utils/behance';

  const PHOTOGRAPHY_FIELD_ID = 73;
  export let data: any;
  $: projects = (data?.projects as BehanceProfileProject[]).filter((project) =>
    project.fields.some((field) => field.id === PHOTOGRAPHY_FIELD_ID)
  );
  $: selectedProjectId = Number($page.url.searchParams.get('id'));
  $: selectedProject = projects?.find((project) => project.id === selectedProjectId) as
    | BehanceProfileProject
    | undefined;

  beforeNavigate(({ to }) => {
    if (!to.url.pathname.includes('/photos')) {
      // strange behaviour when selectedProjectId is defined and navigating away
      // the layout would persist, clearing the variable here seems to fix that issue
      selectedProjectId = undefined;
    }
  });
</script>

<svelte:head>
  <title>
    photos | {selectedProject?.name || 'haydon lam'}
  </title>
</svelte:head>

<SidebarLayout class={!!selectedProject ? ' photo-view' : ''}>
  <Sidebar class={selectedProjectId ? 'sidebar-hidden' : ''}>
    {#each projects || [] as project}
      <SidebarItem
        title={project.name}
        iconHref={project.url}
        active={project?.id === selectedProjectId}
        on:click={() => {
          if (selectedProjectId === project.id) {
            goto('/photos');
          } else {
            goto(`?id=${project.id}`);
          }
        }}
      >
        <svelte:fragment slot="icon">
          <ExternalLink style="width:var(--font-size-body);height:var(--font-size-body)" />
        </svelte:fragment>

        <svelte:fragment slot="details">
          {@const images = imagesFromAllModules(project.allModules)}

          <span>{images.length} Photo(s)</span>
          <span>Last Modified: {formatTimestamp(project.modifiedOn)}</span>
        </svelte:fragment>
      </SidebarItem>
    {/each}
  </Sidebar>
  <section class="photo-content" class:photo-view={!!selectedProjectId}>
    {#if selectedProjectId}
      <div class="masonry-container">
        {#key selectedProjectId}
          <Masonry
            animate={false}
            minColWidth={250}
            maxColWidth={600}
            items={imagesFromAllModules(selectedProject.allModules) || []}
            getId={(item) => Object.values(item)[0].url}
            let:item
          >
            <BehanceImage behanceImage={item} />
          </Masonry>
        {/key}
      </div>
    {:else}
      <div class="image-icon-wrapper">
        <Image />
      </div>
    {/if}
  </section>
</SidebarLayout>

<style>
  .photo-content {
    display: contents;
  }
  .image-icon-wrapper {
    display: grid;
    place-items: center;
    width: 100%;
  }
  .masonry-container {
    display: flex;
    width: 100%;
    overflow: auto;
  }

  @media (--breakpoints-sm-max) {
    /* the sidebar */
    .photo-view > :global(ul) {
      display: none;
    }
    .photo-content:not(.photo-view) {
      display: none;
    }
    :global(.sidebar-hidden) {
      display: none;
    }
  }
</style>
