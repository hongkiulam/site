import { useGLTF, PresentationControls, Edges } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

const PulsingEdges = ({ color, maxScale, ...props }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const pulse = (Math.sin(state.clock.elapsedTime * 5) + 1) * 0.5; // 0 to 1
      ref.current.scale.y = 1.01 + pulse * (maxScale - 1);
      ref.current.scale.x = 1.01 + pulse * (maxScale - 1);
    }
  });

  return <Edges ref={ref} color={color} {...props} linewidth={1} />;
};

// remove pulsing edge animation. add animation on scroll, animation is like tapping card.
const StarlingCard3D = () => {
  const gltf = useGLTF('/website_homepage_assets.gltf');
  const mastercardRed = '#eb001b';
  const mastercardYellow = '#f79e1b';
  const textColor = '#2A133E';
  const chipGold = '#d4af37';

  const cameraPosition = useMemo(() => [0, 0, 400] as const, []);
  const textMaterial = useMemo(
    () => <meshBasicMaterial color={textColor} transparent opacity={0.5} />,
    []
  );

  return (
    <Canvas
      className="w-full h-full"
      orthographic
      camera={{
        position: cameraPosition,
        zoom: 0.5
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
        rotation={[-0.5, -0.3, -0.3]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <group>
          <mesh {...gltf.nodes.Card}>
            <meshBasicMaterial color="#82DDC3" />
            <PulsingEdges color="#82DDC3" maxScale={1.05} />
            <PulsingEdges color="#82DDC3" maxScale={1.1} />
          </mesh>
          <mesh {...gltf.nodes.CardBrand}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.CardType}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.CardTypeIcon}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.WorldDebit}>{textMaterial}</mesh>
          <mesh {...gltf.nodes.Chip}>
            <meshBasicMaterial color={chipGold} />
          </mesh>
          <mesh {...gltf.nodes.MastercardLeft}>
            <meshBasicMaterial color={mastercardRed} opacity={0.5} transparent />
          </mesh>
          <mesh {...gltf.nodes.MastercardRight}>
            <meshBasicMaterial color={mastercardYellow} opacity={0.5} transparent />
          </mesh>
        </group>
      </PresentationControls>
    </Canvas>
  );
};

export default StarlingCard3D;
