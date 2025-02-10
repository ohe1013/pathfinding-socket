import { useState, useRef, useEffect } from "react";
import { Item } from "./ImageItem";
import useGalleryStore from "@/store/galleryImage";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { galleryImages } from "./data";

export const Gallery = ({ w = 4, h = 6, gap = 0.2 }) => {
  // const { width } = useThree((state) => state.viewport);
  // const xW = w + gap;
  const [clicked, setClicked] = useState<number>(-1);
  const { setClickedIdx } = useGalleryStore();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const groupRef = useRef<THREE.Group>(null);

  const handleClick = (value: number) => {
    setClicked(value);
    if (value !== -1) {
      setClickedIdx(true, value);
    } else {
      setClickedIdx(false, null);
    }
  };

  // ✅ 터치 및 마우스 이벤트 핸들러
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.clientX);
  };
  const minScrollX = 0;
  const maxScrollX = -(galleryImages.length - 1) * (w + gap);
  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    const delta = 0.025;
    const moveX = e.clientX - startX;
    setScrollX((prev) => {
      const newX = prev + moveX * delta;
      return Math.min(Math.max(newX, maxScrollX), minScrollX); // 🔥 제한 적용
    });
    setStartX(e.clientX);
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setScrollX(0); // 윈도우 사이즈가 변경되면 위치 초기화
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const scrollProgress = -scrollX / (galleryImages.length * (w + gap));
  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <group position-x={scrollX}>
        {galleryImages.map((url, i) => (
          <Item
            key={i}
            index={i}
            position={[i * (w + gap), 0, 0]}
            scale={[w, h]}
            url={url}
            clicked={clicked}
            setClicked={handleClick}
            scrollProgress={scrollProgress}
          />
        ))}
      </group>
    </group>
  );
};
