import { useState } from "react";
import { ScrollControls, Scroll } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Minimap } from "./Minimap";
import { Item } from "./ImageItem";

export const galleryImages = Array.from(
  { length: 19 },
  (_, i) => `/images/${String(i + 1).padStart(2, "0")}.jpg`
);
export const Gallery = ({ w = 0.7, gap = 0.15 }) => {
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  const [clicked, setClicked] = useState<number | null>(null); // ✅ useState로 관리
  return (
    <ScrollControls
      horizontal
      damping={0.1}
      pages={(width - xW + galleryImages.length * xW) / width}
    >
      <Minimap total={galleryImages.length} />
      <Scroll>
        {galleryImages.map((url, i) => (
          <Item
            key={i}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 4, 1]}
            url={url}
            clicked={clicked}
            setClicked={setClicked}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
};
