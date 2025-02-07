import { useState } from "react";
import { ScrollControls, Scroll } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
// import { Minimap } from "./Minimap";
import { Item } from "./ImageItem";
import useGalleryStore from "@/store/galleryImage";

export const galleryImages = Array.from(
  { length: 19 },
  (_, i) => `/images/${String(i + 1).padStart(2, "0")}.jpg`
);

export const Gallery = ({ w = 4, h = 6, gap = 0.2 }) => {
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  const [clicked, setClicked] = useState<number>(-1); // ✅ `null` 대신 `-1` 기본값
  const { setClickedIdx } = useGalleryStore();
  const handleClick = (value: number) => {
    setClicked(value);
    if (value !== -1) {
      setClickedIdx(true, value);
    } else {
      setClickedIdx(false, null);
    }
  };
  return (
    <>
      <ScrollControls
        horizontal
        damping={0.1}
        pages={(width - xW + galleryImages.length * xW) / width}
      >
        {/* <Minimap total={galleryImages.length} /> */}
        <Scroll>
          {galleryImages.map((url, i) => (
            <Item
              key={i}
              index={i}
              position={[i * (w + gap), 0, 0]} // ✅ X축으로 정렬
              scale={[w, h]} // ✅ 원본 크기 유지 (비율 유지)
              url={url}
              clicked={clicked}
              setClicked={handleClick}
            />
          ))}
        </Scroll>
      </ScrollControls>
    </>
  );
};
