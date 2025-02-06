import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { galleryImages } from "./Gallery";

interface ItemProps {
  index: number;
  position: [number, number, number];
  scale: [number, number];
  url: string;
  clicked: number;
  setClicked: (index: number) => void;
}

export const Item = ({ index, position, scale, url, clicked, setClicked }: ItemProps) => {
  const ref = useRef<THREE.Mesh | null>(null);
  const scroll = useScroll();
  const [hovered, setHovered] = useState(false);

  const click = () => setClicked(index === clicked ? -1 : index);
  const over = () => setHovered(true);
  const out = () => setHovered(false);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const mesh = ref.current;
    const material = mesh.material as THREE.MeshBasicMaterial;

    const y = scroll.curve(
      index / galleryImages.length - 1.5 / galleryImages.length,
      4 / galleryImages.length
    );

    const scaleFactor = clicked === index ? 1.2 : 1; // ✅ 확대 비율 1.2배로 조정 (1.5 → 1.2)
    easing.damp3(mesh.scale, [scale[0] * scaleFactor, scale[1] * scaleFactor, 1 + y], 0.15, delta);

    // ✅ 클릭된 이미지 위치 조정
    if (clicked !== -1 && index < clicked)
      easing.damp(mesh.position, "x", position[0] - 2, 0.15, delta);
    if (clicked !== -1 && index > clicked)
      easing.damp(mesh.position, "x", position[0] + 2, 0.15, delta);
    if (clicked === -1 || clicked === index)
      easing.damp(mesh.position, "x", position[0], 0.15, delta);

    // ✅ grayscale 값 조정 (완전히 0이 아닌, 원본 대비 10% 감소)
    const grayscaleValue = hovered ? 0.2 : clicked === index ? 0.3 : Math.max(0, 1 - y);
    easing.damp(material, "grayscale", grayscaleValue, 0.15, delta);

    // ✅ 클릭된 이미지 색상 유지 (너무 밝아지지 않게)
    const colorTarget = hovered ? "white" : clicked === index ? "#ddd" : "#aaa";
    easing.dampC(material.color, colorTarget, 0.3, delta);
  });

  return (
    <Image
      ref={ref}
      url={url}
      position={position}
      scale={scale}
      transparent={true}
      rotation={[0, 0, 0]}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  );
};
