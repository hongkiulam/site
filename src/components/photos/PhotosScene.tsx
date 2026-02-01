import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Grid,
  Box as BoxDrei,
  Text,
  useTexture,
  ScrollControls,
  useScroll
} from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import type { ImageSizes, SanitisedBehancePhotographyProject } from '@@types/behance';

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

interface InteractiveImageProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  url: string;
}
const InteractiveImage = ({ position, rotation, width, height, url }: InteractiveImageProps) => {
  const { camera } = useThree();
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // if (clicked) {
      //   easing.damp(groupRef.current.position, 'x', 0, 0.15, delta);
      //   easing.damp(groupRef.current.position, 'y', 8 - 2, 0.15, delta);
      //   easing.damp(groupRef.current.position, 'z', 1, 0.15, delta);
      //   easing.damp(camera.position, 'z', 0, 0.15, delta);
      //   return;
      // }
      if (hover) {
        easing.damp(groupRef.current.position, 'y', position[1] + 0.1, 0.15, delta);
        easing.damp(groupRef.current.rotation, 'z', rotation[2] + 0.02, 0.15, delta);
        easing.damp(groupRef.current.rotation, 'x', rotation[0] + 0.05, 0.15, delta);
        return;
      }

      easing.damp3(groupRef.current.position, position, 0.15, delta);
      easing.dampE(groupRef.current.rotation, rotation, 0.15, delta);
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
      <Suspense fallback={<ImageTexturePlaneGeometry url="/images/photo-image-placeholder.png" />}>
        <ImageTexturePlaneGeometry
          url={url}
          onClick={() => {
            setClicked((c) => !c);
            setHover(false);
            if (groupRef.current) {
              // const worldPosition = new THREE.Vector3();
              // camera.getWorldPosition(worldPosition);
              // groupRef.current.lookAt(worldPosition);
            }
          }}
        />
      </Suspense>
      {/* Shadow casting box under image */}
      <mesh position={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[1, 1, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const ImageTexturePlaneGeometry = ({ url, onClick }: { url: string; onClick?: () => void }) => {
  const texture = useTexture(url);

  // Calculate cover behavior similar to CSS background-size: cover
  React.useEffect(() => {
    if (texture && texture.image) {
      const imageAspect = texture.image.width / texture.image.height;
      const planeAspect = 1; // Our plane is square (1:1)

      if (imageAspect > planeAspect) {
        // Image is wider than plane - scale to fit height, crop width
        const scale = planeAspect / imageAspect;
        texture.repeat.set(scale, 1);
        texture.offset.set((1 - scale) / 2, 0);
      } else {
        // Image is taller than plane - scale to fit width, crop height
        const scale = imageAspect / planeAspect;
        texture.repeat.set(1, scale);
        texture.offset.set(0, (1 - scale) / 2);
      }

      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh position={[0, 0, 0]} onClick={onClick}>
      <planeGeometry attach="geometry" />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

interface SceneProps {
  project: SanitisedBehancePhotographyProject;
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

const ResponsiveGrid: React.FC<{ project: SanitisedBehancePhotographyProject }> = ({ project }) => {
  const groupRef = useRef<THREE.Group>(null);
  const {
    columns: COLUMN_COUNT,
    imageSize,
    imageRealEstate,
    yAxisPadding,
    viewport
  } = useResponsiveGridLayout();
  // Split projects into rows
  const rows: ImageSizes[][] = [];
  for (let i = 0; i < project.imageSizes.length; i += COLUMN_COUNT) {
    rows.push(project.imageSizes.slice(i, i + COLUMN_COUNT));
  }

  const scroll = useScroll();
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = scroll.horizontal
      ? -viewport.width * (scroll.pages - 1) * scroll.offset
      : 0;
    groupRef.current.position.z = scroll.horizontal
      ? 0
      : viewport.height * (scroll.pages - 1) * -scroll.offset;
  });

  return (
    <group ref={groupRef}>
      {rows.map((columns, row) => {
        return columns.map((project, column) => {
          const yOrigin = -viewport.height / 2 + imageRealEstate / 2 + yAxisPadding;
          const xOrigin = (COLUMN_COUNT - 1) * (-imageRealEstate / 2);

          const TEMP_LOCAL_IMAGE = '/images/0fa300155951063.635e8c3d9ff67.jpg';
          const image = import.meta.env.DEV ? TEMP_LOCAL_IMAGE : project.size_max_1200.url;

          return (
            <InteractiveImage
              key={row + column}
              // url="/images/0fa300155951063.635e8c3d9ff67.jpg"
              url={image || ''}
              width={imageSize}
              height={imageSize}
              position={[xOrigin + imageRealEstate * column, 0.02, yOrigin + imageRealEstate * row]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          );
        });
      })}
    </group>
  );
};

const Scene: React.FC<SceneProps> = ({ project }) => {
  const { viewport, columns, imageRealEstate, yAxisPadding } = useResponsiveGridLayout();

  // Calculate scroll pages using the grid layout values
  const rows = Math.ceil(project.imageSizes.length / columns);
  const totalContentHeight = rows * imageRealEstate + yAxisPadding * 2;
  const pages = Math.max(1, totalContentHeight / viewport.height);

  return (
    <>
      {/* Floor plane to receive shadows */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[viewport.width + 1, viewport.height + 1]} />
        <shadowMaterial transparent opacity={0.1} />
      </mesh>

      {/* Background plane with solid color unaffected by lighting */}
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[viewport.width + 1, viewport.height + 1]} />
        <meshBasicMaterial color={'white'} />
      </mesh>
      <ScrollControls horizontal={false} pages={pages} damping={0}>
        <ResponsiveGrid project={project} />
      </ScrollControls>

      {/* Debug helpers */}
      {/*<DebugHelpers />*/}

      {/* Orbit controls for debugging */}
      {/*<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />*/}
    </>
  );
};

const Lighting = () => {
  return (
    <>
      {/* Soft ambient lighting */}
      {/*<ambientLight intensity={0.4} color="#ffffff" />*/}

      {/* A light source positioned directly above the scene, with color fading from the sky color to the ground color.*/}
      <hemisphereLight intensity={2} color={0xdebda4} groundColor={0xffffff} />

      {/* Main directional light for shadows */}
      <directionalLight position={[-15, 10, -5]} intensity={4} color={0xdebda4} castShadow />

      {/* Fill light from opposite side */}
      <directionalLight position={[3, 5, -3]} intensity={0.3} color="#f0f8ff" />
    </>
  );
};

interface PhotosSceneProps {
  project: SanitisedBehancePhotographyProject;
}
const PhotosScene: React.FC<PhotosSceneProps> = ({ project }) => {
  return (
    <Canvas
      shadows
      // [_, look down, tilt slightly forward]
      camera={{ position: [0, 8, 0.5], fov: 45 }}
      gl={{ antialias: true }}
      className="w-full h-screen"
    >
      <Lighting />
      <Scene project={project} />
    </Canvas>
  );
};

export default PhotosScene;
