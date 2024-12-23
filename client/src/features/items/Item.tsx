import useMapStore from "@/store/map";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { socket } from "../SocketManager";
import { Item as ItemProps } from "@/store/rooms";
import { ThreeEvent } from "@react-three/fiber";
import useInfo from "@/store/info";
import { useGrid } from "@/hooks/useGrid";

export const Item = ({
  item,
}: {
  item: ItemProps;
  guardEvt: boolean;
  setGuardEvt: (item: boolean) => void;
}) => {
  const { name, gridPosition, size, rotation } = item;
  const map = useMapStore((state) => state.state);
  const { scene } = useGLTF(`/models/items/${name}.glb`);
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
      if (item.touchEvt.type === "watchPhoto") {
        setInfoState({ situation: "photo" });
      }
    }
  };
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);
  if (!map) return null;
  return (
    <group position={grid?.gridToVector3([...gridPosition, 0], width, height)} onClick={onClickEvt}>
      <primitive object={clone} rotation-y={((rotation || 0) * Math.PI) / 2}></primitive>
    </group>
  );
};
