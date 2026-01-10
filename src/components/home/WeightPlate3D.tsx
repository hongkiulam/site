import { PresentationControls, Edges, Wireframe, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';

// todo create weight plate stack. animate them separating and hover pulsing
const WeightPlate3D = () => {
  const cameraPosition = useMemo(() => [0, 0, 8] as const, []);

  return (
    <Canvas
      className="w-full h-full"
      orthographic
      camera={{
        position: cameraPosition,
        zoom: 40
        // fov: 50
      }}
      gl={{ antialias: true }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={2} />

      {/* Main directional light */}
      <directionalLight position={[-3, 4, 2]} intensity={2} color="#ffffff" castShadow />

      {/* Secondary fill light */}
      <directionalLight position={[-3, -3, 2]} intensity={0.8} color="#ffffff" />

      {/* Rim light for definition */}
      <pointLight position={[0, 0, -5]} intensity={0.5} color="#4a90e2" />

      <PresentationControls
        snap={true}
        // rotation={[-0.6, 0.3, -0.4]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <group rotation={[0.4, 0, 0]}>
          <Plate position={[0, 0, 0]} color="red" text="20" radius={2} />
          <Plate position={[0, 0.4, 0]} color="blue" text="15" radius={1.8} />
          <Plate position={[0, 0.8, 0]} color="green" text="10" radius={1.6} />
        </group>
      </PresentationControls>
    </Canvas>
  );
};

export default WeightPlate3D;

// add noise to material?
const Plate = ({ position, color, text, radius: radius }) => {
  const metalMaterial = (
    <meshStandardMaterial color={color} metalness={0.8} roughness={0.6} opacity={1} />
  );
  return (
    <group position={position}>
      {/* Weight Plate Base */}
      <mesh castShadow receiveShadow>
        {metalMaterial}
        <Geometry>
          <Base>
            <cylinderGeometry args={[radius, radius, 0.15, 64]} />
          </Base>
          <Subtraction>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 32]} />
          </Subtraction>
        </Geometry>
      </mesh>
      {/*rim*/}
      <mesh receiveShadow castShadow position={[0, 0.2, 0]}>
        {metalMaterial}
        <Geometry>
          <Base>
            <cylinderGeometry args={[radius, radius, 0.25, 64]} />
          </Base>
          <Subtraction>
            <cylinderGeometry args={[radius - 0.1, radius - 0.1, 0.25, 32]} />
          </Subtraction>
        </Geometry>
      </mesh>

      <mesh receiveShadow castShadow position={[0, 0.15, 0]}>
        {metalMaterial}
        <Geometry>
          <Base>
            <cylinderGeometry args={[0.6, 0.6, 0.1, 64]} />
          </Base>
          <Subtraction>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
          </Subtraction>
        </Geometry>
      </mesh>

      <Text
        position={[0, 0.15, -radius + 0.6]}
        fontSize={0.5}
        color="#ccc"
        rotation={[Math.PI / 2, Math.PI / 1, Math.PI]}
      >
        {text}
      </Text>
    </group>
  );
};
