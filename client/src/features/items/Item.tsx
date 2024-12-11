import useMapStore from "@/store/map";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { socket } from "../SocketManager";
import { Item as ItemProps } from "@/store/rooms";
import { ThreeEvent } from "@react-three/fiber";
import useInfo from "@/store/info";

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
  const go = (e: ThreeEvent<MouseEvent>) => {
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
  if (!map) return null;
  return (
    <mesh onClick={go}>
      <primitive
        object={clone}
        position={[
          width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
          item.positionY || 0,
          height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
        ]}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    </mesh>
  );
};
