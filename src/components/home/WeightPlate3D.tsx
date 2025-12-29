import { PresentationControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg';

const WeightPlate3D = () => {
  const cameraPosition = useMemo(() => [0, 0, 8] as const, []);

  return (
    <Canvas
      className="w-full h-full"
      camera={{
        position: cameraPosition,
        fov: 50
      }}
      gl={{ antialias: true }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />

      {/* Main directional light */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" castShadow />

      {/* Secondary fill light */}
      <directionalLight position={[-3, -3, 2]} intensity={0.8} color="#ffffff" />

      {/* Rim light for definition */}
      <pointLight position={[0, 0, -5]} intensity={0.5} color="#4a90e2" />

      <PresentationControls
        snap={true}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <group rotation={[0, Math.PI / 4, Math.PI / 2]}>
          {/* Main Weight Plate */}
          <mesh castShadow receiveShadow>
            <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.3} />
            <Geometry>
              <Base>
                {/* Main plate body */}
                <cylinderGeometry args={[2, 2, 0.3, 64]} />
              </Base>

              {/* Center hole */}
              <Subtraction>
                <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
              </Subtraction>

              {/*Plate Inset*/}
              <Subtraction position={[0, 0.1, 0]}>
                <Geometry>
                  {/*cut away a slightly smaller cylinder, leaving the edge */}
                  <Base>
                    <cylinderGeometry args={[1.9, 1.9, 0.25, 64]} />
                  </Base>
                  {/*but keep some material in the middle*/}
                  <Subtraction>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                  </Subtraction>
                </Geometry>
              </Subtraction>
            </Geometry>
          </mesh>

          <axesHelper />

          {/* Weight text (raised) - "45" */}
          <mesh position={[0, 0.5, 0.16]} castShadow>
            <meshStandardMaterial color="#ecf0f1" metalness={0.5} roughness={0.5} />
            <boxGeometry args={[0.6, 0.4, 0.02]} />
          </mesh>

          {/* LBS text indicator */}
          <mesh position={[0, 0.2, 0.16]} castShadow>
            <meshStandardMaterial color="#ecf0f1" metalness={0.5} roughness={0.5} />
            <boxGeometry args={[0.3, 0.1, 0.02]} />
          </mesh>
        </group>
      </PresentationControls>
    </Canvas>
  );
};

export default WeightPlate3D;
