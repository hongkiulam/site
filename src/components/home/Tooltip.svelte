<script lang="ts">
  import { flip, inline, offset } from '@floating-ui/dom';
  import { computePosition } from '@floating-ui/dom';
  import { onMount, type Snippet } from 'svelte';
  import { createAnimatable } from 'animejs';
  let { children, linkedElId }: { linkedElId: string; children: Snippet } = $props();

  let popover: HTMLElement | null = null;
  let rotateInertiaTimeout = $state<number>(0);

  const isMobileDevice =
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const computeTooltipPosition = async (
    referenceElement: Pick<HTMLElement, 'getBoundingClientRect'>
  ) => {
    const { x, y } = await computePosition(referenceElement, popover!, {
      placement: 'top',
      middleware: [flip(), offset(10), isMobileDevice ? inline() : undefined]
    });
    return { left: x, top: y };
  };

  const createVirtualElementFromMouseEvent = (
    e: MouseEvent
  ): Pick<HTMLElement, 'getBoundingClientRect'> => {
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
          }
        };
        return rect as DOMRect;
      }
    };
  };

  let prevCursorX = $state<number>(0);
  const lateralMoveDirectionFromMouseEvent = (e: MouseEvent): 'left' | 'right' | 'stable' => {
    const currentCursorX = e.clientX;
    const direction = currentCursorX > prevCursorX ? 'right' : 'left';
    if (Math.abs(currentCursorX - prevCursorX) < 30) {
      return 'stable';
    }
    prevCursorX = currentCursorX;
    return direction;
  };

  onMount(() => {
    const linkedElement = document.getElementById(linkedElId);

    if (!linkedElement) {
      throw new Error(`Tooltip root element with id "${linkedElId}" not found.`);
    }

    if (!popover) {
      throw new Error(
        'Popover element not found. Make sure to bind the popover element correctly.'
      );
    }

    const animatableTooltip = createAnimatable(popover, {
      x: 400,
      y: 400,
      rotate: 0
    });

    const abortController = new AbortController();

    const establishInitialPosition = async () => {
      const { left, top } = await computeTooltipPosition(linkedElement);
      animatableTooltip.x(left, 0);
      animatableTooltip.y(top + 20, 0);
      animatableTooltip.y(top, 400);
    };

    if (isMobileDevice) {
      linkedElement.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();

          establishInitialPosition();
          popover?.showPopover();
        },
        { signal: abortController.signal }
      );
    } else {
      linkedElement.addEventListener(
        'mouseleave',
        () => {
          popover?.hidePopover();
        },
        { signal: abortController.signal }
      );

      linkedElement.addEventListener(
        'mousemove',
        (e) => {
          const direction = lateralMoveDirectionFromMouseEvent(e);
          computeTooltipPosition(createVirtualElementFromMouseEvent(e)).then(({ left, top }) => {
            animatableTooltip.x(left, 1000, 'outBack');
            animatableTooltip.y(top, 400, 'out(3)');
          });

          window.clearTimeout(rotateInertiaTimeout);
          switch (direction) {
            case 'left':
              animatableTooltip.rotate(4, 1000);
              break;
            case 'right':
              animatableTooltip.rotate(-4, 1000);
              break;
            case 'stable':
            default:
              // do nothing, timeout will handle it
              break;
          }
          rotateInertiaTimeout = window.setTimeout(() => {
            animatableTooltip.rotate(0, 1000, 'outBack');
          }, 100);
        },
        { signal: abortController.signal }
      );

      linkedElement.addEventListener(
        'mouseenter',
        (e) => {
          establishInitialPosition();
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
  popover={isMobileDevice ? 'auto' : 'manual'}
  bind:this={popover}
>
  {@render children?.()}
</aside>

<style>
  @reference "../../styles/global.css";

  /* applies to both mobile and desktop */
  .tooltip {
    @apply p-3 rounded-sm shadow text-muted-foreground bg-muted-background border-accent border-2 pointer-events-none overflow-hidden
    left-0 top-0;
  }

  /* Desktop */
  .tooltip {
    @apply absolute;
    transition:
      opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      display 0.5s allow-discrete,
      overlay 0.5s allow-discrete;
    opacity: 0;
  }
  .tooltip:popover-open {
    opacity: 1;

    @starting-style {
      opacity: 0;
    }
  }
</style>
