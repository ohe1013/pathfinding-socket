import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";

const material = new THREE.LineBasicMaterial({ color: "white" });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.5, 0),
  new THREE.Vector3(0, 0.5, 0),
]);

export const Minimap = ({ total }: { total: number }) => {
  const ref = useRef<THREE.Group | null>(null);
  const scroll = useScroll();
  const { height } = useThree((state) => state.viewport);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, index) => {
      const y = scroll.curve(index / total - 1.5 / total, 4 / total);
      easing.damp(child.scale, "y", 0.15 + y / 6, 0.15, delta);
    });
  });

  return (
    <group ref={ref}>
      {[...Array(total)].map((_, i) => (
        <line
          key={i}
          geometry={geometry}
          material={material}
          position={[i * 0.06 - total * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
};
