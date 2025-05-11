import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { TextureLoader, type Group } from "three";
import { Scroll, ScrollControls, Image } from "@react-three/drei";

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
    "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554",
    "https://plus.unsplash.com/premium_photo-1664121799961-e0a18c6c6ca5",
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

interface PhotosSceneProps {}

const PhotosScene: React.FC<PhotosSceneProps> = ({}) => {
  // tOdo calculate pages based on number of images and how wide they are
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <ScrollControls horizontal damping={0.1} pages={2} infinite>
        <Scroll>
          <Scene />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};

export default PhotosScene;
// https://codesandbox.io/p/sandbox/l4klb?file=%2Fsrc%2FApp.js
