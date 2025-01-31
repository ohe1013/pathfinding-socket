import { useState } from "react";
import { ScrollControls, Scroll } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Minimap } from "./Minimap";
import { Item } from "./ImageItem";

const galleryImages = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
];

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
