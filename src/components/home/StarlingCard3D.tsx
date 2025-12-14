import { GradientTexture, useGLTF, PresentationControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

const StarlingCard3D = () => {
  const gltf = useGLTF('/website_homepage_assets.gltf');
  const mastercardRed = '#eb001b';
  const mastercardYellow = '#f79e1b';
  const textColor = '#2A133E';
  const chipGold = '#d4af37';

  const cameraPosition = useMemo(() => [0, 0, 400] as const, []);
  const textMaterial = useMemo(() => <meshBasicMaterial color={textColor} />, []);

  return (
    <Canvas
      className="w-full h-full"
      camera={{
        position: cameraPosition
      }}
      gl={{ antialias: true }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={2} color="#ffffff" />
      {/* Main directional light */}
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" castShadow />
      {/* Secondary fill light */}
      <directionalLight position={[-3, -3, 2]} intensity={0.6} color="#ffffff" />

      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        shadow-mapSize={2048}
        castShadow
      />
      <PresentationControls
        snap={true}
        rotation={[0, -0.3, -0.05]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <group>
          <mesh {...gltf.nodes.Card}>
            <meshBasicMaterial>
              <GradientTexture
                stops={[0, 1]}
                colors={['#82DDC3', '#4EC4A2']}
                rotation={60 * (180 / Math.PI)}
              />
            </meshBasicMaterial>
          </mesh>
          <mesh {...gltf.nodes.CardBrand}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.CardType}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.CardTypeIcon}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.WorldDebit}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.Chip}>
            <meshBasicMaterial color={chipGold} />
          </mesh>
          {/*<mesh {...gltf.nodes.ChipOutlineBacking}></mesh>*/}
          <mesh {...gltf.nodes.MastercardLeft}>
            <meshBasicMaterial color={mastercardRed} />
          </mesh>
          <mesh {...gltf.nodes.MastercardRight}>
            <meshBasicMaterial color={mastercardYellow} />
          </mesh>
        </group>
      </PresentationControls>
    </Canvas>
  );
};

export default StarlingCard3D;
