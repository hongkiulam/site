import React, { useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  Scroll,
  ScrollControls,
  Image,
  OrbitControls,
  useGLTF,
  Instances,
  Instance,
  AccumulativeShadows,
  RandomizedLight,
  PerformanceMonitor
} from '@react-three/drei';
import { Group } from 'three';
import type { SanitisedBehancePhotographyProject } from '@@types/behance';
// import useSpline from '@splinetool/r3f-spline';

interface PhotosSceneProps {
  allProjects: SanitisedBehancePhotographyProject[];
}

// Utility function to calculate GLTF scale based on desired size
const calculateGLTFScale = (gltf: any, targetSize: number): number => {
  // Get the bounding box of the GLTF mesh to determine its original size
  // You may need to adjust this based on your specific GLTF structure
  const geometry = gltf.meshes.case.geometry;
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;

  if (boundingBox) {
    const originalSize = Math.max(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    );
    return targetSize / originalSize;
  }

  // Fallback if bounding box calculation fails
  return targetSize;
};

const useResponsiveGridLayout = () => {
  const { viewport, size } = useThree();
  const mobileColumns = 1;
  const desktopColumns = 2;
  const yAxisPadding = 0.5;

  // Determine columns based on viewport width (mobile breakpoint at 768px)
  const isMobile = size.width <= 768;
  const pixelToThreeUnitsRatio = viewport.width / size.width;
  const columns = isMobile ? mobileColumns : desktopColumns;

  // Calculate image sizes based on pixel constraints and dynamic columns
  let imageSizePx: number;

  if (isMobile) {
    // Mobile: max 800px or 80% screen width
    imageSizePx = Math.min(500, size.width * 0.75);
  } else {
    // Multi-column: divide available width by columns, with some padding
    // Use 90% of available width, divide by columns, with max 600px per image
    const availableWidth = size.width * 0.75;
    const maxImageWidth = availableWidth / columns;
    imageSizePx = Math.min(500, maxImageWidth);
  }

  const imageSize = imageSizePx * pixelToThreeUnitsRatio;
  console.log(imageSize);
  const gap = imageSize * 0.14; // 10% of image size for gap
  const imageRealEstate = imageSize + gap;

  return {
    isMobile,
    pixelToThreeUnitsRatio,
    viewport,
    size,
    columns,
    imageSize,
    gap,
    yAxisPadding,
    imageRealEstate
  };
};

// Interactive image component with hover animation
const InteractiveImage: React.FC<{
  position: [number, number, number];
  imageUrl: string;
  imageSize: number;
}> = ({ position, imageUrl, imageSize }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const targetY = useRef(position[1]);
  const currentY = useRef(position[1]);

  // Update target position when hover state changes
  React.useEffect(() => {
    targetY.current = hovered ? position[1] + 0.2 : position[1];
  }, [hovered, position[1]]);

  // Smooth animation using useFrame
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Lerp towards target position
      const lerpFactor = 1 - Math.exp(-10 * delta); // Smooth interpolation
      currentY.current += (targetY.current - currentY.current) * lerpFactor;
      groupRef.current.position.set(position[0], currentY.current, position[2]);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Shadow plane behind the image, kinda shit */}
      {/*<mesh position={[0, 0, -0.001]}>
        <boxGeometry args={[imageSize, imageSize, 0.001]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>*/}

      {/* TODO convert to plastic sleeve */}
      {/*<mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[imageSize * 1.02, imageSize * 1.02]} />
        <meshBasicMaterial color="#f8f8f8" />
      </mesh>*/}

      {/* Main photo positioned behind the case */}
      <Image
        url={imageUrl}
        scale={[imageSize, imageSize]}
        position={[0, 0, -0.01]}
        side={2} // DoubleSide
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      />
    </group>
  );
};

// Component to render responsive grid of images
const ResponsiveImageGrid: React.FC<{ allProjects: SanitisedBehancePhotographyProject[] }> = ({
  allProjects
}) => {
  const { viewport, columns, yAxisPadding, imageSize, imageRealEstate } = useResponsiveGridLayout();
  const gltf = useGLTF('/album_plastic_playground.gltf');

  // Calculate total height needed for scrolling
  const rows = Math.ceil(allProjects.length / columns);
  const totalContentHeight = rows * imageRealEstate + yAxisPadding;

  // Calculate the scale factor needed to match imageSize using the utility function
  const scaleFactorForCase = calculateGLTFScale(gltf, imageSize * 1.1);

  return (
    <>
      {/* Instanced GLTF cases for performance */}
      <Instances geometry={gltf.meshes.case.geometry} frustumCulled={false}>
        <meshPhysicalMaterial
          transparent
          thickness={0.1}
          reflectivity={0.9}
          transmission={1}
          roughness={0}
        />
        {allProjects.map((project, index) => {
          // Calculate grid position
          const col = index % columns;
          const row = Math.floor(index / columns);

          // Center the grid horizontally
          const totalGridWidth = (columns - 1) * imageRealEstate;
          const xOffset = -totalGridWidth / 2;
          const x = col * imageRealEstate + xOffset;

          // Position from top to bottom
          const y = viewport.height / 2 - row * imageRealEstate - imageSize / 2;

          const TEMP_LOCAL_IMAGE = '/images/0fa300155951063.635e8c3d9ff67.jpg';

          return (
            <group key={project.id} position={[x, y - yAxisPadding, 0]}>
              <Instance
                key={`case-${project.id}`}
                position={[0, 0, 0]}
                scale={scaleFactorForCase}
              />
              <InteractiveImage
                position={[0, 0, 0]}
                imageUrl={TEMP_LOCAL_IMAGE}
                imageSize={imageSize}
              />
            </group>
          );
        })}
      </Instances>
    </>
  );
};

const PhotosScene: React.FC<PhotosSceneProps> = ({ allProjects }) => {
  const { viewport, columns, imageRealEstate, yAxisPadding } = useResponsiveGridLayout();

  // Calculate scroll pages using the grid layout values
  const rows = Math.ceil(allProjects.length / columns);
  const totalContentHeight = rows * imageRealEstate + yAxisPadding * 2;
  const pages = Math.max(1, totalContentHeight / viewport.height);

  return (
    <>
      <ambientLight intensity={1} />
      {/*<OrbitControls />*/}
      <AccumulativeShadows temporal frames={100} scale={10}>
        <RandomizedLight amount={8} position={[5, 5, -10]} />
      </AccumulativeShadows>
      <ScrollControls horizontal={false} pages={pages} damping={0.2}>
        <Scroll>
          <ResponsiveImageGrid allProjects={allProjects} />
        </Scroll>
      </ScrollControls>
    </>
  );
};

/**
 * So that we have access to Three.js hooks within {@link PhotosScene}
 */
const withProviders =
  <Props extends object>(Component: React.ComponentType<Props>) =>
  (props: Props) => {
    return (
      <Canvas>
        <Component {...props} />
      </Canvas>
    );
  };
export default withProviders(PhotosScene);
// https://codesandbox.io/p/sandbox/l4klb?file=%2Fsrc%2FApp.js
