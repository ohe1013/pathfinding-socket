import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, useScroll } from "@react-three/drei";
import { easing } from "maath";

export const Item = ({ index, position, scale, url, clicked, setClicked }) => {
  const ref = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const [hovered, hover] = useState(false);

  const click = () => setClicked(index === clicked ? null : index);
  const over = () => hover(true);
  const out = () => hover(false);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const mesh = ref.current as THREE.Mesh; // ✅ 안전한 타입 단언
    const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length);

    // ✅ scale은 Mesh에서만 조작해야 함
    easing.damp3(
      mesh.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta
    );

    // ❌ mesh.material.scale 제거 (Material에는 scale 속성이 없음)

    if (clicked !== null && index < clicked)
      easing.damp(mesh.position, "x", position[0] - 2, 0.15, delta);
    if (clicked !== null && index > clicked)
      easing.damp(mesh.position, "x", position[0] + 2, 0.15, delta);
    if (clicked === null || clicked === index)
      easing.damp(mesh.position, "x", position[0], 0.15, delta);

    easing.damp(
      mesh.material as any,
      "grayscale",
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      0.15,
      delta
    );
    easing.dampC(
      mesh.material.color,
      hovered || clicked === index ? "white" : "#aaa",
      hovered ? 0.3 : 0.15,
      delta
    );
  });

  return (
    <Image
      ref={ref}
      url={url}
      position={position}
      scale={scale}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  );
};
