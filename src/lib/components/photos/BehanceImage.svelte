<script lang="ts">
  import type { ImageSizes } from '$types/behance';
  import Loader from '../shared/Loader.svelte';
  export let behanceImage: ImageSizes;
  const possibleSizesMap: [number, keyof ImageSizes][] = [
    [600, 'size_disp'],
    [1200, 'size_max_1200'],
    [1400, 'size_1400_opt_1'],
    [1920, 'size_fs'],
    [2800, 'size_2800_opt_1']
  ];

  const srcset = possibleSizesMap
    .map(([w, size]) => (behanceImage[size] ? `${behanceImage[size].url} ${w}w` : ''))
    .filter((x) => !!x)
    .join(', ');

  let showInLightbox = false;
  let realImageLoading = false;
  let imageLoadingLock = false;
  /** Will always load for a minimum amount of time artificially */
  $: artificalImageLoading = realImageLoading || imageLoadingLock;
  const minimumImageLoadingTime = 500; //ms

  // let imageZoom = 1;
  // $: if (!showInLightbox) {
  //   // reset image zoom when closing lightbox
  //   imageZoom = 1;
  // }
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === 'Escape' && showInLightbox) {
      showInLightbox = false;
    }
  }}
/>
{#if showInLightbox}
  <div class="backdrop" />
{/if}

<div class="image-container">
  <div
    class="lightbox"
    class:open={showInLightbox}
    on:keydown={() => {}}
    on:click={() => {
      showInLightbox = false;
    }}
  >
    <img
      srcset={showInLightbox ? srcset : undefined}
      sizes={showInLightbox ? '(max-width: 2800px) 100vw, 2800px' : undefined}
      src={behanceImage['size_disp'].url}
      style="width:{behanceImage['size_disp'].width}; height:{behanceImage['size_disp'].height};"
      alt=""
      loading="lazy"
      class:lightbox-open={showInLightbox}
      class:loading={artificalImageLoading}
      on:keydown={() => {}}
      on:click|stopPropagation={(e) => {
        // const image = e.currentTarget;
        // const width = window.getComputedStyle(image).width;
        // const rawWidth = Number(width.replace('px', ''));
        // console.log(rawWidth * 1.5);
        // image.style.width = rawWidth * 1.5 + 'px';
        // image.style.height = 'auto';
        // image.style.maxHeight = 'initial';
        // image.style.maxWidth = 'initial';
        // console.log(width);
        // todo: fix bad scrolling behaviour. Maye have to move away from transform, and to aybe adjust width directly
        // if (imageZoom > 3) {
        //   imageZoom = 1;
        // } else {
        //   imageZoom = imageZoom * 1.5;
        // }
      }}
      on:load={() => {
        if (showInLightbox) {
          realImageLoading = false;
        }
      }}
    />
    {#if showInLightbox && artificalImageLoading}
      <div class="loader">
        <Loader />
      </div>
    {/if}
  </div>

  <img
    src={behanceImage['size_disp'].url}
    style="width:{behanceImage['size_disp'].width}; height:{behanceImage['size_disp'].height}"
    alt=""
    loading="lazy"
    on:keydown={() => {}}
    on:click|stopPropagation={() => {
      // trigger loading stuff when we are about to show in lightbox
      if (!showInLightbox) {
        realImageLoading = true;
        imageLoadingLock = true;
        setTimeout(() => {
          imageLoadingLock = false;
        }, minimumImageLoadingTime);
      }
      showInLightbox = !showInLightbox;
    }}
  />
</div>

<style>
  img {
    width: 100%;
    cursor: pointer;
  }

  img.lightbox-open {
    width: min-content;
    height: min-content;
    max-width: 100%;
    max-height: 100%;
    border-style: solid;
    border-color: var(--color-copy-1);
    border-width: var(--spacing-2);
  }
  img.loading {
    visibility: hidden;
    height: 1px;
  }
  img:not(.loading) {
    animation: image-fade 0.3s ease forwards;
  }
  @keyframes image-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--100pvh, 100vh);
    z-index: 1;
    backdrop-filter: blur(5px);
    filter: brightness(0.5);
  }
  .image-container {
    display: grid;
    /* fixes funny div additional spacing behaviour */
    place-items: center;
  }
  .lightbox {
    display: none;
  }

  /* important to override style attribute set by macy */
  .lightbox.open {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    z-index: 2;
    height: var(--100pvh, 100vh);
    width: 100vw !important;
    overflow: auto;
  }
  :global(.lightbox.open::-webkit-scrollbar) {
    width: 10px !important;
  }
  .loader {
    grid-column: 1/2;
    grid-row: 1/2;
    z-index: -1;
  }
</style>
