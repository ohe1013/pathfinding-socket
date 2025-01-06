import useMapStore from "@/store/map";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { socket } from "../SocketManager";
import { Item as ItemProps } from "@/store/rooms";
import { ThreeEvent } from "@react-three/fiber";
import useInfo from "@/store/info";
import { useGrid } from "@/hooks/useGrid";
import * as THREE from "three";

export const Item = ({
  item,
}: {
  item: ItemProps;
  guardEvt: boolean;
  setGuardEvt: (item: boolean) => void;
  onCharacterMoveToItem: (position: THREE.Vector3) => void;
}) => {
  const { name, gridPosition, size, rotation } = item;
  const map = useMapStore((state) => state.state);
  const { scene } = useGLTF(`/models/items/${name}.glb`, true);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
  const setInfoState = useInfo((state) => state.setState);
  const grid = useGrid();
  const onClickEvt = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (item.touchEvt) {
      if (item.touchEvt.type === "switchRoom") {
        socket.emit("joinRoom", item.touchEvt.roomId, {
          position: item.touchEvt.position,
        });
      }
      if (item.touchEvt.type === "watchGuestBook") {
        setInfoState({ situation: "guestbook" });
      }
    }
  };
  useEffect(() => {
    clone.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [clone]);
  if (!map) return null;
  return (
    <group
      position={grid?.gridToVector3([...gridPosition, 0], width, height)}
      position-y={item.positionY ?? 0}
      onClick={onClickEvt}
    >
      <primitive
        object={clone}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      ></primitive>
      {renderLight(item)}
    </group>
  );
};
const renderLight = (item: ItemProps) => {
  const isLightConfigured = !!item.light;
  if (!isLightConfigured) return null; // 조명 속성이 없으면 종료

  const lightProps = item.light!;
  switch (lightProps.type) {
    case "spotLight":
      return (
        <spotLight
          position={lightProps.position}
          angle={lightProps.angle}
          intensity={lightProps.intensity}
          penumbra={lightProps.penumbra}
          castShadow={false}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          color={lightProps.color}
        />
      );
    case "pointLight":
      return (
        <pointLight
          position={lightProps.position}
          intensity={lightProps.intensity}
          distance={lightProps.distance}
          decay={lightProps.decay}
          color={lightProps.color}
          castShadow={false}
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
        />
      );
    default:
      return null;
  }
};
