<script lang="ts">
  const SVG_ORIGIN = { x: 150, y: 50 };

  let topSpread = $state(0);

  function s(pt: { x: number; y: number }) {
    return `${SVG_ORIGIN.x + pt.x} ${SVG_ORIGIN.y + pt.y}`;
  }

  function C(
    cp1: { x: number; y: number },
    cp2: { x: number; y: number },
    end: { x: number; y: number },
  ) {
    return `C ${s(cp1)} ${s(cp2)} ${s(end)}`;
  }

  const spoonPath = $derived.by(() => {
    const bTL = { x: -topSpread, y: 0 };
    const bTR = { x: topSpread, y: 0 };
    const bMR = { x: 60, y: 50 };
    const bML = { x: -60, y: 50 };
    const bBR = { x: 20, y: 100 };
    const bBL = { x: -20, y: 100 };
    const hMR = { x: 11, y: 113 };
    const hML = { x: -11, y: 113 };
    const hBR = { x: 9, y: 212 };
    const hBL = { x: -9, y: 212 };

    return [
      `M ${s(bTL)}`,
      `L ${s(bTR)}`,
      C({ x: bTR.x + (bMR.x - bTR.x) * 0.75, y: bTR.y }, { x: bMR.x, y: bMR.y * 0.6 }, bMR),
      C({ x: bMR.x, y: bMR.y + (bBR.y - bMR.y) * 0.5 }, { x: bBR.x + (bMR.x - bBR.x) * 0.625, y: bBR.y - 5 }, bBR),
      C({ x: bBR.x - 5, y: bBR.y + 2 }, { x: hMR.x + 1, y: hMR.y - 6 }, hMR),
      `L ${s(hBR)}`,
      C({ x: hBR.x, y: hBR.y + 8 }, { x: hBL.x, y: hBL.y + 8 }, hBL),
      `L ${s(hML)}`,
      C({ x: hML.x - 1, y: hML.y - 6 }, { x: bBL.x + 5, y: bBL.y + 2 }, bBL),
      C({ x: bBL.x + (bML.x - bBL.x) * 0.625, y: bBL.y - 5 }, { x: bML.x, y: bML.y + (bBL.y - bML.y) * 0.5 }, bML),
      C({ x: bML.x, y: bML.y * 0.6 }, { x: bTL.x + (bML.x - bTL.x) * 0.75, y: bTL.y }, bTL),
      'Z',
    ].join('\n             ');
  });
</script>

<section class="w-full flex flex-col items-center p-8">
  <h2 class="mb-8">Spoon Template SVG Generator</h2>

  <div class="flex items-center justify-center flex-1 w-full">
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="spoon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#aaa" />
          <stop offset="35%" style="stop-color:#eee" />
          <stop offset="65%" style="stop-color:#ccc" />
          <stop offset="100%" style="stop-color:#999" />
        </linearGradient>
      </defs>
      <path d={spoonPath} fill="url(#spoon-gradient)" stroke="#888" stroke-width="1" />
    </svg>
  </div>

  <div class="controls">
    <label class="control-row">
      <span class="label">Bowl top spread</span>
      <input class="slider" type="range" min="0" max="50" step="1" bind:value={topSpread} />
      <input class="number" type="number" min="0" max="50" step="1" bind:value={topSpread} />
    </label>
  </div>
</section>

<style>
  @reference "../../styles/global.css";

  .controls {
    @apply mt-6 flex flex-col gap-4 w-full max-w-sm;
  }

  .control-row {
    @apply flex items-center gap-3;
  }

  .label {
    @apply text-sm text-muted-foreground w-36 shrink-0;
  }

  .slider {
    @apply flex-1 accent-current;
  }

  .number {
    @apply w-16 text-right text-sm bg-muted-background border border-accent rounded px-2 py-1;
  }
</style>
