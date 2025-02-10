import * as THREE from "three";
import { useRef, useState } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { easing } from "maath";
import { galleryImages } from "./data";

interface ItemProps {
  index: number;
  position: [number, number, number];
  scale: [number, number];
  url: string;
  clicked: number;
  scrollProgress: number;
  setClicked: (index: number) => void;
}

export const Item = ({
  index,
  position,
  scale,
  url,
  clicked,
  setClicked,
  scrollProgress,
}: ItemProps) => {
  const ref = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null); // ✅ Material 참조 추가
  const xOffset = useRef(0); // ✅ useRef로 상태 유지
  const [hovered, setHovered] = useState(false);

  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(index === clicked ? -1 : index);
  };
  const over = () => setHovered(true);
  const out = () => setHovered(false);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const mesh = ref.current;
    if (!materialRef.current) materialRef.current = mesh.material as THREE.MeshBasicMaterial;
    const material = materialRef.current;

    // ✅ xOffset을 useRef로 업데이트
    easing.damp(xOffset, "current", scrollProgress * 4 - index / galleryImages.length, 0.15, delta);

    // ✅ 애니메이션 적용
    const scaleFactor = clicked === index ? 1.5 : 1;
    easing.damp3(
      mesh.scale,
      [scale[0] * scaleFactor, scale[1] * scaleFactor, 1 + xOffset.current],
      0.15,
      delta
    );

    // ✅ 위치 조정
    if (clicked !== -1 && index < clicked)
      easing.damp(mesh.position, "x", position[0] - 2, 0.15, delta);
    if (clicked !== -1 && index > clicked)
      easing.damp(mesh.position, "x", position[0] + 2, 0.15, delta);
    if (clicked === -1 || clicked === index)
      easing.damp(mesh.position, "x", position[0], 0.15, delta);

    // ✅ grayscale 값 조정
    const grayscaleValue = hovered
      ? 0.2
      : clicked === index
      ? 0.3
      : Math.max(0, 1 - xOffset.current);
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
