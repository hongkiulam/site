import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, type Vector3 } from '@react-three/fiber';
import { Flex, Box } from '@react-three/flex';
import { OrbitControls, Image, Grid, Box as BoxDrei, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import type { SanitisedBehancePhotographyProject } from '@@types/behance';

const DebugHelpers: React.FC = () => {
  return (
    <>
      {/* Debug helpers */}
      <Grid args={[20, 20]} position={[0, -2.01, 0]} />

      {/* Axis helper - red=X, green=Y, blue=Z */}
      <primitive object={new THREE.AxesHelper(5)} />

      {/* Position markers with labels */}
      <BoxDrei args={[0.1, 0.1, 0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial color="red" />
      </BoxDrei>
      <Text position={[0.3, 0, 0]} fontSize={0.3} color="red" anchorX="left" anchorY="middle">
        Origin
      </Text>

      <BoxDrei args={[0.1, 0.1, 0.1]} position={[1, 0, 0]}>
        <meshBasicMaterial color="green" />
      </BoxDrei>
      <Text position={[1.3, 0, 0]} fontSize={0.3} color="green" anchorX="left" anchorY="middle">
        X
      </Text>

      <BoxDrei args={[0.1, 0.1, 0.1]} position={[0, 1, 0]}>
        <meshBasicMaterial color="blue" />
      </BoxDrei>
      <Text position={[0, 1.3, 0]} fontSize={0.3} color="blue" anchorX="center" anchorY="bottom">
        Y
      </Text>

      <BoxDrei args={[0.1, 0.1, 0.1]} position={[0, 0, 1]}>
        <meshBasicMaterial color="purple" />
      </BoxDrei>
      <Text position={[0, 0, 1.3]} fontSize={0.3} color="purple" anchorX="center" anchorY="middle">
        Z
      </Text>
    </>
  );
};

const IMAGE_SIZE = 1;

interface InteractiveImageProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  url: string;
}
const InteractiveImage = ({ position, rotation, width, height, url }: InteractiveImageProps) => {
  const texture = useTexture(url);
  const [hover, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      easing.damp(
        groupRef.current.position,
        'y',
        hover ? position[1] + 0.1 : position[1],
        0.15,
        delta
      );
      easing.damp(
        groupRef.current.rotation,
        'z',
        hover ? rotation[2] + 0.05 : rotation[2],
        0.15,
        delta
      );
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      scale={[width, height, 0.01]}
      ref={groupRef}
      onPointerEnter={() => {
        setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
      }}
    >
      <mesh position={[0, 0, 0]}>
        <planeGeometry attach="geometry" />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
      {/* Shadow casting box under image */}
      <mesh position={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[1, 1, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

interface SceneProps {
  allProjects: SanitisedBehancePhotographyProject[];
}

const Scene: React.FC<SceneProps> = ({ allProjects }) => {
  console.log(allProjects);
  return (
    <>
      {/* Floor plane to receive shadows */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 20]} />
        <meshStandardMaterial color="#ffedcf" />
      </mesh>

      <Flex
        position={[0, 0, -IMAGE_SIZE]}
        flexDirection="row"
        // justifyContent="flex-start"
        // alignItems="center"
        wrap="wrap-reverse"
        plane="xz"
        size={[5, 20, 0]}
      >
        {allProjects.map((project, index) => {
          return (
            <Box key={project.id} margin={0.1}>
              <InteractiveImage
                url="/images/0fa300155951063.635e8c3d9ff67.jpg"
                // url={project.covers.size_202?.url || ''}
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                position={[0, 0.02, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <Text fontSize={0.5} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                {index}
              </Text>
            </Box>
          );
        })}
      </Flex>

      {/* Debug helpers */}
      <DebugHelpers />

      {/* Orbit controls for debugging */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

const Lighting = () => {
  return (
    <>
      {/* Soft ambient lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Main directional light for shadows */}
      <directionalLight position={[-5, 10, -5]} intensity={0.8} color="#ffffff" castShadow />

      {/* Fill light from opposite side */}
      <directionalLight position={[3, 5, -3]} intensity={0.3} color="#f0f8ff" />
    </>
  );
};

interface PhotosSceneProps {
  allProjects: SanitisedBehancePhotographyProject[];
}
const PhotosScene: React.FC<PhotosSceneProps> = ({ allProjects }) => {
  return (
    <Canvas
      shadows
      // [_, look down, tilt slightly forward]
      camera={{ position: [0, 8, 0.5], fov: 45 }}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100vh' }}
    >
      <Lighting />
      <Scene allProjects={allProjects} />
    </Canvas>
  );
};

export default PhotosScene;
