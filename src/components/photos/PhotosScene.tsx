import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { TextureLoader, type Group, MOUSE, TOUCH, PerspectiveCamera } from 'three';
import { Scroll, ScrollControls, Image, OrbitControls, MapControls } from '@react-three/drei';
import type { SanitisedBehancePhotographyProject } from '@@types/behance';

interface ImageProps {
  src: string;
  width?: number;
  height?: number;
}

// Component that handles the dragging/scrolling functionality
const Scene: React.FC = () => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const imageUrls = [
    'https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554',
    'https://plus.unsplash.com/premium_photo-1664121799961-e0a18c6c6ca5'
  ];
  return (
    <>
      {imageUrls.map((url, index) => (
        <Image
          key={index}
          url={url}
          position={[index * 2, 0, 0]} // Adjust position based on index
          scale={[1, 1]} // Adjust scale as needed
          onClick={() => {}}
          onPointerEnter={() => {}}
          onPointerLeave={() => {}}
          // width={viewport.width * 0.8} // Adjust width based on viewport
          // height={viewport.height * 0.8} // Adjust height based on viewport
        />
      ))}
    </>
  );
};

interface PhotosSceneProps {
  allProjects: SanitisedBehancePhotographyProject[];
}

const PhotosScene: React.FC<PhotosSceneProps> = ({ allProjects }) => {
  const imagesPerSide = Math.ceil(Math.sqrt(allProjects.length));

  return (
    <Canvas>
      <ambientLight intensity={1} />
      <MapControls
        mouseButtons={{
          LEFT: MOUSE.PAN,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.ROTATE
        }}
        touches={{
          ONE: TOUCH.PAN,
          TWO: TOUCH.DOLLY_PAN
        }}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={1}
        maxDistance={10}
        screenSpacePanning={true}
      />
      {allProjects.map((project, index) => {
        const imageSize = 1.4;
        const gap = 0.2;
        const imageRealEstate = imageSize + gap / 2;
        const allowableXVariance = gap / 4;

        // The x offset shifts all images half the grid size to the left, centering the grid to the page
        const xOffset = Math.floor(imagesPerSide / 2);
        // x goes 0,1,2,3,0,1,2,3 as we increment the index (assuming imagesPerSide is 4)
        const x = Math.ceil((index % imagesPerSide) - xOffset);
        // Assuming imagesPerSide is 4, every 4 images will increment the row e.g. 0,0,0,0,1,1,1,1,2,...
        const row = Math.floor(index / imagesPerSide);
        /*
         * Assuming imagesPerSide is 5, we want to place the rows from the center in alternate directions
         * Rows in sequence      Rendered Row
         *                0 ->     -2          0 / 2 -> 0                        =  0
         *                1 ->     -1          1 / 2 -> 0.5 (ceil) -> 1 (isOdd)  = -1
         *                2 ->      0          2 / 2 -> 1                        =  1
         *                3 ->      1          3 / 2 -> 1.5 (ceil) -> 2 (isOdd)  = -2
         *                4 ->      2          4 / 2 -> 2                        =  2
         */
        const halvedRow = Math.ceil(row / 2);
        const rowIsOdd = row % 2 === 1; // 1, 3, 5 ...
        const flippedRow = rowIsOdd ? halvedRow * -1 : halvedRow;
        const y = flippedRow;

        const url = project.imageSizes[0].size_disp.url;
        const TEMP_LOCAL_IMAGE = '/images/0fa300155951063.635e8c3d9ff67.jpg';

        const variance = Math.random() * allowableXVariance;
        return (
          <Image
            key={project.id}
            url={TEMP_LOCAL_IMAGE}
            scale={[imageSize, imageSize]}
            position={[x * imageRealEstate + variance, y * imageRealEstate, 0]}
            rotation={[0, 0, 0.2 * variance]}
          />
        );
      })}
    </Canvas>
  );
};

export default PhotosScene;
// https://codesandbox.io/p/sandbox/l4klb?file=%2Fsrc%2FApp.js
