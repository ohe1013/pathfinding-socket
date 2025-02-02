import { Item as ItemProps } from "@/store/rooms";
import { useMemo } from "react";

export const RenderLight = ({ light }: { light: ItemProps["light"] }) => {
  return useMemo(() => {
    if (!light) return null;
    switch (light.type) {
      case "spotLight":
        return (
          <spotLight
            position={light.position}
            angle={light.angle}
            intensity={light.intensity}
            penumbra={light.penumbra}
            castShadow={false}
            shadow-mapSize={[256, 256]}
            color={light.color}
          />
        );
      case "pointLight":
        return (
          <pointLight
            position={light.position}
            intensity={light.intensity}
            distance={light.distance}
            decay={light.decay}
            color={light.color}
            castShadow={false}
            shadow-mapSize={[256, 256]}
          />
        );
      default:
        return null;
    }
  }, [light]); // light 값이 변경될 때만 다시 계산
};
