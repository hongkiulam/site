<script lang="ts">
  const SVG_ORIGIN = { x: 150, y: 50 };

  let topSpread        = $state(0);
  let middleSpread     = $state(60);
  let baseSpread       = $state(20);
  let handleMidSpread  = $state(11);
  let handleBotSpread  = $state(9);

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
    const bTL = { x: -topSpread,       y: 0   };
    const bTR = { x:  topSpread,       y: 0   };
    const bMR = { x:  middleSpread,    y: 50  };
    const bML = { x: -middleSpread,    y: 50  };
    const bBR = { x:  baseSpread,      y: 100 };
    const bBL = { x: -baseSpread,      y: 100 };
    const hMR = { x:  handleMidSpread, y: 113 };
    const hML = { x: -handleMidSpread, y: 113 };
    const hBR = { x:  handleBotSpread, y: 212 };
    const hBL = { x: -handleBotSpread, y: 212 };

    return [
      `M ${s(bTL)}`,
      `L ${s(bTR)}`,
      C({ x: bTR.x + (bMR.x - bTR.x) * 0.75,      y: bTR.y                          }, { x: bMR.x,                             y: bMR.y * 0.6                    }, bMR),
      C({ x: bMR.x,                                  y: bMR.y + (bBR.y - bMR.y) * 0.5 }, { x: bBR.x + (bMR.x - bBR.x) * 0.625, y: bBR.y - 5                      }, bBR),
      C({ x: bBR.x - 5,                              y: bBR.y + 2                      }, { x: hMR.x + 1,                         y: hMR.y - 6                      }, hMR),
      `L ${s(hBR)}`,
      C({ x: hBR.x, y: hBR.y + 8 }, { x: hBL.x, y: hBL.y + 8 }, hBL),
      `L ${s(hML)}`,
      C({ x: hML.x - 1,                              y: hML.y - 6                      }, { x: bBL.x + 5,                         y: bBL.y + 2                      }, bBL),
      C({ x: bBL.x + (bML.x - bBL.x) * 0.625,      y: bBL.y - 5                      }, { x: bML.x,                              y: bML.y + (bBL.y - bML.y) * 0.5 }, bML),
      C({ x: bML.x,                                  y: bML.y * 0.6                    }, { x: bTL.x + (bML.x - bTL.x) * 0.75,   y: bTL.y                          }, bTL),
      'Z',
    ].join('\n             ');
  });

  const controls: { label: string; bind: () => number; set: (v: number) => void; min: number; max: number }[] = [
    { label: 'Bowl top',       bind: () => topSpread,       set: v => topSpread = v,       min: 0,  max: 55 },
    { label: 'Bowl middle',    bind: () => middleSpread,    set: v => middleSpread = v,    min: 20, max: 90 },
    { label: 'Bowl base',      bind: () => baseSpread,      set: v => baseSpread = v,      min: 5,  max: 55 },
    { label: 'Handle middle',  bind: () => handleMidSpread, set: v => handleMidSpread = v, min: 2,  max: 30 },
    { label: 'Handle bottom',  bind: () => handleBotSpread, set: v => handleBotSpread = v, min: 2,  max: 25 },
  ];
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
    {#each controls as ctrl}
      <label class="control-row">
        <span class="label">{ctrl.label}</span>
        <input
          class="slider"
          type="range"
          min={ctrl.min}
          max={ctrl.max}
          step="1"
          value={ctrl.bind()}
          oninput={e => ctrl.set(Number((e.target as HTMLInputElement).value))}
        />
        <input
          class="number"
          type="number"
          min={ctrl.min}
          max={ctrl.max}
          step="1"
          value={ctrl.bind()}
          oninput={e => ctrl.set(Number((e.target as HTMLInputElement).value))}
        />
      </label>
    {/each}
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
    @apply text-sm text-muted-foreground w-32 shrink-0;
  }

  .slider {
    @apply flex-1 accent-current;
  }

  .number {
    @apply w-16 text-right text-sm bg-muted-background border border-accent rounded px-2 py-1;
  }
</style>
