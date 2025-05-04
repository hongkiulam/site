import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { createTimeline } from "animejs";
import { useIsFirstMount } from "../lib/hooks/useIsFirstMount";

interface MobileNavPageWipeProps {
  isOpen: boolean;
}

const MobileNavPageWipe = ({ isOpen = false }: MobileNavPageWipeProps) => {
  const isFirstMount = useIsFirstMount();
  const rootRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const waveGraphicsRef = useRef<PIXI.Graphics | null>(null);
  const animationStateRef = useRef({
    amplitude: 0,
    width: 0,
    frequency: 0,
  });

  const baseFrequency =
    typeof window !== "undefined" ? 5 / window.innerHeight : 0;

  useEffect(() => {
    const scaledAmplitude = (max: number) => {
      const estimatedAverageWidth = 1440; // let's just assume this is the average width
      const targetAmplitude = max;
      const ratio = estimatedAverageWidth / targetAmplitude;
      return window.innerWidth / ratio > max ? max : window.innerWidth / ratio;
    };

    const amplitudeVariation = Math.random() * 50;
    if (isOpen) {
      const timeline = createTimeline();
      timeline
        .add(
          animationStateRef.current,
          {
            amplitude: scaledAmplitude(50) + amplitudeVariation,
            duration: 200,
          },
          0
        )
        .add(
          animationStateRef.current,
          {
            frequency: Math.random() / 200,
            duration: 500,
          },
          0
        )
        .add(
          animationStateRef.current,
          { width: window.innerWidth, duration: 500 },
          0
        )
        .add(animationStateRef.current, { amplitude: 0, duration: 250 }, 250);
    } else if (!isFirstMount) {
      // do not animate on first mount
      const timeline = createTimeline();
      timeline
        .add(
          animationStateRef.current,
          {
            amplitude: scaledAmplitude(50) + amplitudeVariation,
            duration: 200,
          },
          0
        )
        .add(animationStateRef.current, { amplitude: 0, duration: 100 }, 350)
        .add(
          animationStateRef.current,
          { width: 0, frequency: 0, duration: 500 },
          0
        );
    }
  }, [isOpen]);

  // Initialize Pixi application
  useEffect(() => {
    if (!rootRef.current) return;

    // Create Pixi application
    const app = new PIXI.Application();
    const init = async () => {
      await app.init({
        resizeTo: window,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundAlpha: 0,
      });
      if (!rootRef.current) return;
      // Add view to the DOM
      rootRef.current.appendChild(app.canvas);
      appRef.current = app;

      // Create graphics object for the waves
      const waveGraphics = new PIXI.Graphics();
      app.stage.addChild(waveGraphics);
      waveGraphicsRef.current = waveGraphics;

      // Animation loop
      app.ticker.add(() => {
        drawWaves(waveGraphics, app.renderer.height, app.renderer.width);
      });
    };
    init();

    // Cleanup
    return () => {
      app.destroy(true, true);
    };
  }, []);

  const drawWaves = (
    graphics: PIXI.Graphics,
    height: number,
    width: number
  ) => {
    // extra drawing height to ensure we fill the screen
    const heightPadding = 50;
    // Clear previous drawing
    graphics.clear();

    graphics.moveTo(width, -heightPadding);
    const {
      amplitude,
      width: waveWidth,
      frequency,
    } = animationStateRef.current;
    const waveFrequency = baseFrequency + frequency; // Frequency of the wave
    for (let y = 0; y <= height + heightPadding * 2; y += 5) {
      const x = width - waveWidth - Math.sin(waveFrequency * y) * amplitude;
      graphics.lineTo(x, y);
    }

    graphics.lineTo(width, height + heightPadding);
    graphics.fill(
      getComputedStyle(document.body).getPropertyValue("--muted-foreground")
    );
  };

  return (
    <div
      ref={rootRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none isolate z-1"
    />
  );
};

export default MobileNavPageWipe;
