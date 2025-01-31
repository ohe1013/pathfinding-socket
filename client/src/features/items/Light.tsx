import { Item as ItemProps } from "@/store/rooms";

export const RenderLight = ({ light }: { light: ItemProps["light"] }) => {
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
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
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
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
        />
      );
    default:
      return null;
  }
};
