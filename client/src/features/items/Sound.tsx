import { PositionalAudio } from "@react-three/drei";
import { Item as ItemProps } from "@/store/rooms";
import * as THREE from "three";
import { RefObject } from "react";

type SoundProps = {
  sound: ItemProps["sound"];
  soundRef: RefObject<THREE.PositionalAudio>;
};

export const RenderSound = (item: SoundProps) => {
  if (item.sound) {
    return (
      <PositionalAudio
        ref={item.soundRef}
        url={item.sound.src}
        distance={20}
        loop={true}
        autoplay={true}
      />
    );
  }
};
