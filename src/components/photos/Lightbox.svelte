<script lang="ts">
  import { onMount } from 'svelte';
  import { panZoomCanvas } from './panZoomCanvas';

  let {
    src,
    onclose
  }: { src: string; onclose: () => void } = $props();

  let isLoading = $state(true);
  let hasError = $state(false);

  let dialog = $state<HTMLDialogElement | undefined>(undefined);

  onMount(() => {
    dialog?.showModal();
  });
</script>

<dialog closedby="closerequest" bind:this={dialog} onclose={() => onclose()} class="lightbox">
  <form method="dialog" class="clamped absolute left-1/2 -translate-x-6/12">
    <button
      class="px-2 py-1 bg-background/80 rounded-sm"
      aria-label="Close lightbox"
      formmethod="dialog">Close</button
    >
  </form>
  <canvas
    class="block touch-none cursor-default"
    use:panZoomCanvas={{
      src,
      onloaded: () => (isLoading = false),
      onerror: () => {
        isLoading = false;
        hasError = true;
      }
    }}
  ></canvas>

  {#if isLoading}
    <div class="lightbox-status">Loading...</div>
  {/if}

  {#if hasError}
    <div class="lightbox-status">Failed to load image</div>
  {/if}
</dialog>

<style>
  @reference "../../styles/global.css";

  .lightbox {
    all: unset;
    @apply fixed inset-0 w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-background/90 shadow-2xl;
    @apply transition-all duration-400 ease-out;

    @apply open:translate-y-0 open:scale-100;
    @apply starting:open:translate-y-full starting:open:scale-95;
  }

  .lightbox::backdrop {
    background: transparent;
  }

  .lightbox-status {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    pointer-events: none;
  }
</style>
