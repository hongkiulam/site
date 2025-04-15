<script lang="ts">
  import { flip, offset } from "@floating-ui/dom";
  import { computePosition } from "@floating-ui/dom";
  import { onMount, type Snippet } from "svelte";

  let { children, tooltipId }: { tooltipId: string; children: Snippet } =
    $props();
  let popover: HTMLElement | null = null;
  let tooltipLeft = $state<string>();
  let tooltipTop = $state<string>();
  const isMobileDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const computeAndSetTooltipPosition = (
    referenceElement: Pick<HTMLElement, "getBoundingClientRect">
  ) => {
    computePosition(referenceElement, popover!, {
      placement: "top-end",
      middleware: [flip(), offset(10)],
    }).then(({ x, y }) => {
      tooltipLeft = `${x}px`;
      tooltipTop = `${y}px`;
    });
  };

  const createVirtualElementFromMouseEvent = (
    e: MouseEvent
  ): Pick<HTMLElement, "getBoundingClientRect"> => {
    return {
      getBoundingClientRect: () => {
        const rect = {
          width: 0,
          height: 0,
          x: e.clientX,
          y: e.clientY,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX,
          toJSON: function () {
            return this;
          },
        };
        return rect as DOMRect;
      },
    };
  };

  onMount(() => {
    const tooltipRoot = document.getElementById(tooltipId);

    if (!tooltipRoot) {
      throw new Error(`Tooltip root element with id "${tooltipId}" not found.`);
    }

    const abortController = new AbortController();

    if (isMobileDevice) {
      tooltipRoot.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();

          popover?.showPopover();
        },
        { signal: abortController.signal }
      );
    } else {
      tooltipRoot.addEventListener(
        "mouseleave",
        () => {
          popover?.hidePopover();
        },
        { signal: abortController.signal }
      );

      tooltipRoot.addEventListener(
        "mousemove",
        (e) => {
          computeAndSetTooltipPosition(createVirtualElementFromMouseEvent(e));
        },
        { signal: abortController.signal }
      );

      tooltipRoot.addEventListener(
        "mouseenter",
        (e) => {
          computeAndSetTooltipPosition(createVirtualElementFromMouseEvent(e));
          popover?.showPopover();
        },
        { signal: abortController.signal }
      );
    }
    // Cleanup event listeners on component unmount
    return () => {
      abortController.abort();
    };
  });
</script>

<aside
  class="tooltip"
  class:mobile={isMobileDevice}
  style:left={tooltipLeft}
  style:top={tooltipTop}
  popover={isMobileDevice ? "auto" : "manual"}
  bind:this={popover}
>
  {@render children?.()}
</aside>

<style>
  @reference "../../styles/global.css";

  /* applies to both mobile and desktop */
  .tooltip {
    @apply p-3 rounded-sm shadow text-muted-foreground bg-muted-background border-accent border-2;
  }

  /* Desktop */
  .tooltip:not(.mobile) {
    @apply absolute;
    transition:
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      transform 1s cubic-bezier(0.16, 1, 0.3, 1),
      display 0.5s allow-discrete,
      overlay 0.5s allow-discrete;
    opacity: 0;
    transform: translateX(-20px) translateY(16px) rotate(-5deg);
  }
  .tooltip:not(.mobile):popover-open {
    opacity: 1;
    transform: translate(0, 0) rotate(2deg);

    @starting-style {
      opacity: 0;
      transform: translateX(-20px) translateY(16px) rotate(-5deg);
    }
  }

  /* Mobile */
  .tooltip.mobile {
    @apply fixed;
    transition:
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      display 0.5s allow-discrete,
      overlay 0.5s allow-discrete;
    opacity: 0;
    top: unset;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    max-height: 70vh;
  }

  .tooltip.mobile:popover-open {
    opacity: 1;
    transform: translateY(0);

    @starting-style {
      opacity: 0;
      transform: translateY(100%);
    }
  }
</style>
