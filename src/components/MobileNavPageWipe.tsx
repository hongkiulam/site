import { useRef } from 'react';

interface MobileNavPageWipeProps {
  isOpen: boolean;
}

/**
 * Generate sine wave or square path for clip-path
 *
 * @param width - Base X position as percentage (e.g. 50 = 50% from left edge)
 *                This is where the "straight" part of the rectangle extends to
 * @param amplitude - Wave amplitude as percentage (e.g. 3 = ±3% wobble)
 *                    When 0, creates a straight edge (square rectangle)
 *                    When >0, creates sine wave oscillation around the base width
 *
 * Example with width=50, amplitude=3:
 * - Rectangle goes from 0% to ~50% width
 * - Right edge oscillates between 47% and 53% (50 ± 3)
 * - When amplitude=0: straight edge at 100% (fills container)
 */
const generateSineWavePath = (width: number = 15, amplitude: number = 3): string => {
  const points: string[] = [];
  const frequency = 4; // Number of complete sine waves from top to bottom

  // Start polygon from top-left corner (0%, 0%)
  points.push('0 0');

  // Generate points along the right edge every 2% vertically
  for (let i = 0; i <= 100; i += 2) {
    const y = i; // Y position as percentage (0% = top, 100% = bottom)

    // Calculate X position: base width + sine wave oscillation
    const x = width + amplitude * Math.sin((y / 100) * frequency * Math.PI);

    points.push(`${x}% ${y}%`);
  }

  // Close the polygon back to bottom-left corner (0%, 100%)
  points.push('0 100%');

  return `polygon(${points.join(', ')})`;
};

const MobileNavPageWipe = ({ isOpen = false }: MobileNavPageWipeProps) => {
  const leftWipeRef = useRef<HTMLDivElement>(null);
  const rightWipeRef = useRef<HTMLDivElement>(null);

  // No useEffect needed - using CSS transitions directly in style props

  return (
    <>
      {/* Main sliding area taking up 85% */}
      <div
        ref={rightWipeRef}
        className="fixed top-0 h-full pointer-events-none z-1 bg-muted-foreground"
        style={{
          width: '50%',
          left: isOpen ? '50%' : '150%',
          transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* Sine wave rectangle attached to the left edge of main area */}
      <div
        ref={leftWipeRef}
        className="fixed top-0 h-full pointer-events-none z-1 bg-muted-foreground"
        style={{
          width: '50%',
          left: isOpen ? '0%' : '100%',
          transform: 'rotate(180deg)',
          transition: `left 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            clip-path .6s cubic-bezier(0.4, 0, 0.2, 1)`,
          clipPath: isOpen ? generateSineWavePath(100, 0) : generateSineWavePath(80, 15)
        }}
      />
    </>
  );
};

export default MobileNavPageWipe;
