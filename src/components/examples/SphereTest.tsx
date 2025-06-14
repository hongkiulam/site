import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraControls, Text } from '@react-three/drei';

// Create context for camera controls
type CameraControlsContextType = {
  cameraControlsRef: React.RefObject<CameraControls | null> | null;
};

const CameraControlsContext = createContext<CameraControlsContextType>({
  cameraControlsRef: null
});

// Hook to use the camera controls context
export const useCameraControls = () => useContext(CameraControlsContext);

// Utility function to ensure values stay within range
const mod = (n: number, m: number) => ((n % m) + m) % m;

const TOTAL_NUMBER_OF_ITEMS = 48;
// A component that renders a single cell in our grid as a box with a number
const GridCell: React.FC<{
  position: THREE.Vector3;
  size: number;
  itemIndex: number;
}> = ({ position, size, itemIndex }) => {
  const { camera } = useThree();

  // Use the itemIndex to determine which of the 48 items to display
  const actualIndex = mod(itemIndex, TOTAL_NUMBER_OF_ITEMS);

  const groupRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (groupRef.current) {
      // have the grid face the camera for an 'inside sphere' effect
      groupRef.current.lookAt(
        new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)
      );
    }
  });

  const boxGeometry = useMemo(() => new THREE.PlaneGeometry(size * 0.95, size * 0.95), [size]);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]);
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 'darkblue',
        polygonOffset: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      }),
    []
  );

  return (
    <group position={position} ref={groupRef}>
      {/* Box that always faces the camera */}
      <mesh>
        {/* <boxGeometry args={[size * 0.95, size * 0.95, size * 0.1]} /> */}
        {/* <meshStandardMaterial color="pink" /> */}
        <lineSegments geometry={edgesGeometry} material={lineMaterial} />

        {/* Number display */}
        <Text fontSize={0.25}>{actualIndex + 1}</Text>
      </mesh>
    </group>
  );
};

// Component for the infinite grid
const InfiniteGrid: React.FC = () => {
  const { camera } = useThree();
  const gridRef = useRef<THREE.Group>(null);

  // Grid configuration
  const cellSize = 1; // THREE.js units
  // Grid area needed to contain all items
  const gridWidthAndHeight = Math.ceil(Math.sqrt(TOTAL_NUMBER_OF_ITEMS));
  const rows = gridWidthAndHeight;
  const columns = gridWidthAndHeight;

  // The actual size of the grid shown in the UI. Can be larger or smaller than the required area. Adjust for performance, and experience
  const visibleRadius = 4; // How many cells to render in each direction excluding centre cross.
  const visibleGridWidthAndHeight = 1 + visibleRadius * 2;

  // State to track camera position
  const cameraPositionRef = useRef({ x: 0, y: 0 });
  // const [cells, setCells] = useState<React.JSX.Element[]>([]);
  const [cellPositions, setCellPositions] = useState<{ x: number; y: number; itemIndex: number }[]>(
    []
  );

  // TODO, instead of rerenderin the entire grid, let's just update the position of each item, requires a fixed sized grid, filling the empty elements with duplicates.
  // Render grid cells centered around the camera
  const recomputeCells = () => {
    const cellPositionsToSet = [];
    // const cells = [];
    const centerX = Math.floor(camera.position.x / cellSize);
    const centerY = Math.floor(camera.position.y / cellSize);

    for (let x = -visibleRadius; x <= visibleRadius; x++) {
      for (let y = -visibleRadius; y <= visibleRadius; y++) {
        const posX = (centerX + x) * cellSize;
        const posY = (centerY + y) * cellSize;

        // Calculate the item index based on grid position
        // This creates a pattern that repeats in both directions
        const itemIndex = Math.abs(mod(centerX + x, rows) * columns + mod(centerY + y, rows));

        cellPositionsToSet.push({ x: posX, y: posY, itemIndex });
        // cells.push(
        //   <GridCell
        //     key={`${x}-${y}`}
        //     position={new THREE.Vector3(posX, posY, 0)}
        //     size={cellSize}
        //     itemIndex={itemIndex}
        //   />
        // );
      }
    }

    // setCells(cells);
    setCellPositions(cellPositionsToSet);
  };

  // Update grid position based on camera movement
  useFrame(() => {
    if (!gridRef.current) return;

    // Check if camera has moved enough to update the grid
    const newX = Math.floor(camera.position.x / cellSize);
    const newY = Math.floor(camera.position.y / cellSize);

    const cameraPosition = cameraPositionRef.current;
    if (newX !== cameraPosition.x || newY !== cameraPosition.y) {
      cameraPositionRef.current = { x: newX, y: newY };
      recomputeCells();
    }
  });

  useEffect(() => {
    recomputeCells();
  }, []);

  return (
    <group ref={gridRef}>
      {Array(visibleGridWidthAndHeight * visibleGridWidthAndHeight)
        .fill(null)
        .map((_, i) => {
          if (!cellPositions[i]) {
            return null;
          }
          const { x, y, itemIndex } = cellPositions[i];
          return (
            <GridCell
              key={`${x}-${y}`}
              position={new THREE.Vector3(x, y, 0)}
              size={cellSize}
              itemIndex={itemIndex}
            />
          );
        })}
      {/* {cells} */}
    </group>
  );
};

const useZoomOnPointerDown = () => {
  const { camera } = useThree();
  const { cameraControlsRef } = useCameraControls();
  const isPointerDown = useRef(false);

  useEffect(() => {
    if (!cameraControlsRef?.current) return;

    const controls = cameraControlsRef.current;
    const zoomAmount = 0.4;

    const handlePointerDown = () => {
      isPointerDown.current = true;
      controls.zoom(-zoomAmount, true);
    };

    const handlePointerUp = () => {
      if (isPointerDown.current) {
        isPointerDown.current = false;
        controls.zoom(zoomAmount, true);
      }
    };

    // Set up event handlers via CameraControls events
    controls.addEventListener('controlstart', handlePointerDown);
    controls.addEventListener('controlend', handlePointerUp);

    return () => {
      controls.removeEventListener('controlstart', handlePointerDown);
      controls.removeEventListener('controlend', handlePointerUp);
    };
  }, [camera, cameraControlsRef]);

  return null;
};

// Component to apply the zoom effect
const ZoomEffect = () => {
  useZoomOnPointerDown();
  return null;
};

// Taken from camera-controls library
enum CameraControlsActions {
  NONE = 0,
  TRUCK = 2,
  DOLLY = 16,
  TOUCH_TRUCK = 128,
  TOUCH_DOLLY = 1024
}
const SphereTest: React.FC = () => {
  const cameraControlsRef = useRef<CameraControls>(null);

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
      <CameraControlsContext.Provider value={{ cameraControlsRef }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 75, zoom: 2 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <InfiniteGrid />
          <ZoomEffect />
          <CameraControls
            ref={cameraControlsRef}
            dollyToCursor={false}
            mouseButtons={{
              left: CameraControlsActions.TRUCK,
              right: CameraControlsActions.NONE,
              middle: CameraControlsActions.NONE,
              wheel: CameraControlsActions.DOLLY
            }}
            touches={{
              one: CameraControlsActions.TOUCH_TRUCK,
              two: CameraControlsActions.TOUCH_DOLLY,
              three: CameraControlsActions.NONE
            }}
            maxDistance={8}
            minDistance={4}
            truckSpeed={1.8} // 2 default
            smoothTime={0.2}
          />
        </Canvas>
      </CameraControlsContext.Provider>
    </div>
  );
};

export default SphereTest;
