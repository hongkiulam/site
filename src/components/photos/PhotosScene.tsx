import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Scroll, ScrollControls, Image } from '@react-three/drei';
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
    // Mobile: max 800px or 80% screen width
    imageSizePx = Math.min(800, size.width * 0.8);
  } else {
    // Multi-column: divide available width by columns, with some padding
    // Use 90% of available width, divide by columns, with max 600px per image
    const availableWidth = size.width * 0.9;
    const maxImageWidth = availableWidth / columns;
    imageSizePx = Math.min(600, maxImageWidth);
  }

  const imageSize = imageSizePx * pixelToThreeUnitsRatio;
  const gap = imageSize * 0.1; // 10% of image size for gap
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

// Component to render responsive grid of images
const ResponsiveImageGrid: React.FC<{ allProjects: SanitisedBehancePhotographyProject[] }> = ({
  allProjects
}) => {
  const { viewport, columns, yAxisPadding, imageSize, imageRealEstate } = useResponsiveGridLayout();

  // Calculate total height needed for scrolling
  const rows = Math.ceil(allProjects.length / columns);
  const totalContentHeight = rows * imageRealEstate + yAxisPadding;

  return (
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
        const y = viewport.height / 2 - row * imageRealEstate - imageSize / 2;

        const TEMP_LOCAL_IMAGE = '/images/0fa300155951063.635e8c3d9ff67.jpg';

        return (
          <group key={project.id} position={[x, y - yAxisPadding, 0]}>
            {/* Shadow plane behind the image, kinda shit */}
            <mesh position={[0, 0, -0.001]}>
              <boxGeometry args={[imageSize, imageSize, 0.001]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.2} />
            </mesh>

            {/* TODO convert to plastic sleeve */}
            {/*<mesh position={[0, 0, 0.005]}>
              <planeGeometry args={[imageSize * 1.02, imageSize * 1.02]} />
              <meshBasicMaterial color="#f8f8f8" />
            </mesh>*/}

            {/* Main photo with slight forward position for 3D effect */}
            <Image url={TEMP_LOCAL_IMAGE} scale={[imageSize, imageSize]} position={[0, 0, 0.01]} />
          </group>
        );
      })}
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
