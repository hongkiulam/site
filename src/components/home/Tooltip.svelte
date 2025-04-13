<script lang="ts">
  import { flip } from "@floating-ui/dom";
  import { computePosition } from "@floating-ui/dom";
  import { onMount, type Snippet } from "svelte";

  let { children, tooltipId }: { tooltipId: string; children: Snippet } =
    $props();
  let popover: HTMLElement | null = null;
  let tooltipLeft = $state(0);
  let tooltipTop = $state(0);

  const computeAndSetTooltipPosition = (tooltipRoot: HTMLElement) => {
    computePosition(tooltipRoot, popover!, {
      placement: "top-end",
      middleware: [flip()],
    }).then(({ x, y }) => {
      tooltipLeft = x;
      tooltipTop = y;
    });
  };

  onMount(() => {
    const tooltipRoot = document.getElementById(tooltipId);

    if (!tooltipRoot) {
      throw new Error(`Tooltip root element with id "${tooltipId}" not found.`);
    }

    const abortController = new AbortController();
    computeAndSetTooltipPosition(tooltipRoot);
    tooltipRoot.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();

        computeAndSetTooltipPosition(tooltipRoot);
        popover?.showPopover();
      },
      { signal: abortController.signal }
    );

    tooltipRoot.addEventListener(
      "mouseleave",
      () => {
        popover?.hidePopover();
      },
      { signal: abortController.signal }
    );

    tooltipRoot.addEventListener(
      "mouseenter",
      () => {
        computeAndSetTooltipPosition(tooltipRoot);
        popover?.showPopover();
      },
      { signal: abortController.signal }
    );
    return () => {
      abortController.abort();
    };
  });
</script>

<aside
  class="tooltip absolute p-3 rounded-sm shadow text-muted-foreground bg-muted-background border-accent border-2"
  style:left={tooltipLeft + "px"}
  style:top={tooltipTop + "px"}
  popover="auto"
  bind:this={popover}
>
  {@render children?.()}
</aside>

<style>
  .tooltip {
    transition:
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      display 0.5s allow-discrete,
      overlay 0.5s allow-discrete;
    opacity: 0;
    transform: translateX(-20px) translateY(16px) rotate(-5deg);
  }

  .tooltip:popover-open {
    opacity: 1;
    transform: translate(0, 0) rotate(2deg);
    display: flex;
    flex-direction: column;

    @starting-style {
      opacity: 0;
      transform: translateX(-20px) translateY(16px) rotate(-5deg);
    }
  }
</style>
