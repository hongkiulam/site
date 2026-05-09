<script lang="ts">
  import { onMount } from 'svelte';
  import type { ImageSizes } from '@@types/behance';
  import Lightbox from './Lightbox.svelte';

  let { imageSizes, index }: { imageSizes: ImageSizes; index: number } = $props();

  let isActive = $state(false);
  let didPushState = false;

  const fallback =
    imageSizes.size_disp ??
    imageSizes.size_max_1200 ??
    imageSizes.size_1400_opt_1 ??
    imageSizes.size_fs ??
    imageSizes.size_2800_opt_1;

  const fullRes =
    imageSizes.size_fs ??
    imageSizes.size_2800_opt_1 ??
    imageSizes.size_1400_opt_1 ??
    imageSizes.size_max_1200 ??
    fallback;

  const srcsetParts = [
    imageSizes.size_disp && `${imageSizes.size_disp.url} ${imageSizes.size_disp.width}w`,
    imageSizes.size_max_1200 &&
      `${imageSizes.size_max_1200.url} ${imageSizes.size_max_1200.width}w`,
    imageSizes.size_1400_opt_1 &&
      `${imageSizes.size_1400_opt_1.url} ${imageSizes.size_1400_opt_1.width}w`
  ]
    .filter(Boolean)
    .join(', ');

  function readParam(): number | null {
    const p = new URLSearchParams(window.location.search).get('photo');
    if (p === null) return null;
    const n = parseInt(p, 10);
    return isNaN(n) ? null : n;
  }

  function syncFromUrl() {
    isActive = readParam() === index;
  }

  const onClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('photo', String(index));
    history.pushState({ lightboxPush: true }, '', url);
    didPushState = true;
    isActive = true;
  };

  const onclose = () => {
    isActive = false;

    if (new URLSearchParams(window.location.search).has('photo')) {
      if (didPushState) {
        history.back();
      } else {
        const url = new URL(window.location.href);
        url.searchParams.delete('photo');
        history.replaceState({}, '', url);
      }
    }
    didPushState = false;
  };

  onMount(() => {
    syncFromUrl();

    const onPopState = () => {
      didPushState = false;
      syncFromUrl();
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  });
</script>

{#if fallback}
  <div class="perspective-distant">
    <button class="photo-item" onclick={onClick}>
      <img
        src={fallback.url}
        srcset={srcsetParts || undefined}
        sizes={srcsetParts ? '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px' : undefined}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </button>
  </div>
{/if}

<Lightbox src={fullRes.url} {onclose} open={Boolean(isActive && fullRes)} />

<style>
  .photo-item {
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background: transparent;
    display: block;
    width: 100%;
    padding: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition:
      transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center bottom;
  }

  .photo-item:hover {
    transform: rotateX(-4deg) translateZ(-10px) scale(1.03);
    box-shadow: 20px 7px 20px rgba(0, 0, 0, 0.15);
  }

  .photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
