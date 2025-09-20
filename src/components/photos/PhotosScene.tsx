import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  PerformanceMonitor,
  useScroll,
  PerspectiveCamera,
  Merged,
  MeshTransmissionMaterial,
  PositionMesh
} from '@react-three/drei';
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  Mesh,
  MeshPhysicalMaterial
} from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import type { SanitisedBehancePhotographyProject } from '@@types/behance';

interface PhotosSceneProps {
  allProjects: SanitisedBehancePhotographyProject[];
}

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
    // Mobile: max 800px or 60% screen width
    imageSizePx = Math.max(Math.min(500, size.width * 0.6), 250);
  } else {
    // Multi-column: divide available width by columns, with some padding
    // Use 50% of available width, divide by columns, with max 600px per image
    const availableWidth = size.width * 0.5;
    const maxImageWidth = availableWidth / columns;
    imageSizePx = Math.max(Math.min(500, maxImageWidth), 300);
  }

  const imageSize = imageSizePx * pixelToThreeUnitsRatio;
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

      groupRef.current.rotation.x =
        ((hovered ? 0 : Math.PI / 36) - groupRef.current.rotation.x) * lerpFactor;
    }
  });

  return (
    <group ref={groupRef} position={position} rotateX={Math.PI / 36}>
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

const InteractiveCaseInstance = (props: {
  position: [x: number, y: number, z: number];
  imageSize: number;
  caseTopInset: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<PositionMesh | null>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      const targetRotationX = hovered ? Math.PI / 36 : 0; // 5 degrees in radians
      const caseHeight = props.imageSize - props.caseTopInset;
      const halfHeight = caseHeight / 2;

      // Smoothly interpolate rotation
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * delta * 8;

      // Adjust position to keep bottom of mesh fixed during rotation
      // When rotating around X-axis, the Y position needs to be adjusted
      const rotationOffset = halfHeight * (1 - Math.cos(ref.current.rotation.x));
      ref.current.position.y = props.position[1] - rotationOffset;
    }
  });

  return (
    <Instance
      ref={ref}
      position={props.position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    />
  );
};

// Component to render responsive grid of images
const ResponsiveImageGrid: React.FC<{ allProjects: SanitisedBehancePhotographyProject[] }> = ({
  allProjects
}) => {
  const {
    viewport,
    columns,
    yAxisPadding,
    imageSize: IMAGE_SIZE,
    imageRealEstate
  } = useResponsiveGridLayout();
  // const gltf = useGLTF('/album_plastic_playground.gltf');
  const CASE_GUTTER = 0.1;
  const CASE_TOP_INSET = 0.1;
  const CASE_THICKNESS = 0.05;

  const basicCaseGeometry = useMemo(() => {
    const front = new RoundedBoxGeometry(
      IMAGE_SIZE + CASE_GUTTER * 2,
      IMAGE_SIZE - CASE_TOP_INSET,
      CASE_THICKNESS
    );
    const leftSide = new RoundedBoxGeometry(
      CASE_GUTTER, // so that image doesn't touch the side, a little breathing room
      IMAGE_SIZE - CASE_TOP_INSET,
      CASE_THICKNESS
    );
    const rightSide = new RoundedBoxGeometry(
      CASE_GUTTER, // so that image doesn't touch the side, a little breathing room
      IMAGE_SIZE - CASE_TOP_INSET,
      CASE_THICKNESS
    );

    // Position the side geometries relative to the front
    const frontHalfWidth = (IMAGE_SIZE + CASE_GUTTER) / 2;

    // Position left side to the left of the front panel
    leftSide.translate(
      -frontHalfWidth, // Move to left edge
      0,
      -CASE_THICKNESS
    );

    // Position right side to the right of the front panel
    rightSide.translate(
      frontHalfWidth, // Move to right edge
      0,
      -CASE_THICKNESS
    );

    // Merge all geometries into one
    const mergedGeometry = BufferGeometryUtils.mergeGeometries([front, leftSide, rightSide]);

    return mergedGeometry;
  }, [IMAGE_SIZE]);

  return (
    <group>
      <Instances geometry={basicCaseGeometry} frustumCulled={false}>
        <MeshTransmissionMaterial
          background={new Color('#' + 'e0dce6')}
          backside={true}
          transmission={1}
          roughness={0.5}
          thickness={0.05}
          reflectivity={0.5}
          // ior={1.5}
          chromaticAberration={0.06}
          wireframe={false}
        />

        <>
          {allProjects.map((project, index) => {
            // Calculate grid position
            const col = index % columns;
            const row = Math.floor(index / columns);

            // Center the grid horizontally
            const totalGridWidth = (columns - 1) * imageRealEstate;
            const xOffset = -totalGridWidth / 2;
            const x = col * imageRealEstate + xOffset;

            // Position from top to bottom
            const y = viewport.height / 2 - row * imageRealEstate - IMAGE_SIZE / 2;

            const TEMP_LOCAL_IMAGE = '/images/0fa300155951063.635e8c3d9ff67.jpg';

            return (
              <group key={project.id} position={[x, y - yAxisPadding, 0]}>
                <InteractiveCaseInstance
                  key={`case-${project.id}`}
                  position={[0, -(CASE_TOP_INSET * 1.5), 0.05]}
                  imageSize={IMAGE_SIZE}
                  caseTopInset={CASE_TOP_INSET}
                />
                <InteractiveImage
                  position={[0, 0, 0]}
                  imageUrl={TEMP_LOCAL_IMAGE}
                  imageSize={IMAGE_SIZE}
                />
              </group>
            );
          })}
        </>
      </Instances>
    </group>
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
      {/*<OrbitControls enableZoom={true} />*/}
      {/*<AccumulativeShadows temporal frames={100} scale={10}>
        <RandomizedLight amount={8} position={[5, 5, -10]} />
      </AccumulativeShadows>*/}
      <ScrollControls horizontal={false} pages={pages} damping={0.1}>
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
