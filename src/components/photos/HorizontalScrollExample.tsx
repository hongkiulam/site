import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { proxy, useSnapshot } from 'valtio';
import { easing } from 'maath';
import { BufferGeometry, Color, Group, LineBasicMaterial, Vector3 } from 'three';
import type { SanitisedBehancePhotographyProject } from '@@types/behance';

const material = new LineBasicMaterial({ color: 'black' });
const geometry = new BufferGeometry().setFromPoints([
  new Vector3(0, -0.5, 0),
  new Vector3(0, 0.5, 0)
]);
const state = proxy<{ clicked: null | number; urls: string[] }>({
  clicked: null,
  urls: []
});

function Minimap() {
  const ref = useRef<Group | null>(null);
  const scroll = useScroll();
  const { urls } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);
  useFrame((state, delta) => {
    ref.current?.children.forEach((child, index) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length);
      easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {urls.map((_, i) => (
        <line
          key={i}
          geometry={geometry}
          material={material}
          position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
}

function Item({ index, position, scale, c = new Color(), ...props }) {
  const ref = useRef();
  const scroll = useScroll();
  const { clicked, urls } = useSnapshot(state);
  const [hovered, hover] = useState(false);
  const click = () => (state.clicked = index === clicked ? null : index);
  const over = () => hover(true);
  const out = () => hover(false);
  useFrame((state, delta) => {
    const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length);
    easing.damp3(
      ref.current.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta
    );
    ref.current.material.scale[0] = ref.current.scale.x;
    ref.current.material.scale[1] = ref.current.scale.y;
    if (clicked !== null && index < clicked)
      easing.damp(ref.current.position, 'x', position[0] - 2, 0.15, delta);
    if (clicked !== null && index > clicked)
      easing.damp(ref.current.position, 'x', position[0] + 2, 0.15, delta);
    if (clicked === null || clicked === index)
      easing.damp(ref.current.position, 'x', position[0], 0.15, delta);
    easing.damp(
      ref.current.material,
      'grayscale',
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      0.15,
      delta
    );
    easing.dampC(
      ref.current.material.color,
      hovered || clicked === index ? 'white' : '#aaa',
      hovered ? 0.3 : 0.15,
      delta
    );
  });
  return (
    <Image
      ref={ref}
      {...props}
      position={position}
      scale={scale}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  );
}

interface ItemsProps {
  images: string[];
  w?: number;
  gap?: number;
}
function Items({ w = 0.7, gap = 0.15, images }: ItemsProps) {
  const { urls } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  useEffect(() => {
    state.urls = images;
  }, [images]);

  return (
    <ScrollControls horizontal damping={0.1} pages={(width - xW + urls.length * xW) / width}>
      <Minimap />
      <Scroll>
        {
          urls.map((url, i) => <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} url={url} />) /* prettier-ignore */
        }
      </Scroll>
    </ScrollControls>
  );
}

interface HorizontalScrollExampleProps {
  allProjects: SanitisedBehancePhotographyProject[];
  initialProjectSlug: string;
}
const HorizontalScrollExample = ({
  allProjects,
  initialProjectSlug
}: HorizontalScrollExampleProps) => {
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(initialProjectSlug);

  const images = useMemo(() => {
    return allProjects.find((project) => project.slug === selectedProjectSlug);
  }, [allProjects, initialProjectSlug, selectedProjectSlug]);

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} onPointerMissed={() => (state.clicked = null)}>
      {images && <Items images={images.imageSizes.map((size) => size.size_disp.url) || []} />}
    </Canvas>
  );
};

export default HorizontalScrollExample;
