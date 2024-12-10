import useMapStore from "@/store/map";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { socket } from "../SocketManager";

export const Item = ({ item }) => {
  const { name, gridPosition, size, rotation } = item;
  const map = useMapStore((state) => state.state);
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
  const go = () => {
    socket.emit("joinRoom", item.touchEvt.roomId, item.touchEvt.position);
  };
  return (
    <mesh onClick={item?.touchEvt ? () => go() : () => {}}>
      <primitive
        object={clone}
        position={[
          width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
          0,
          height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
        ]}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    </mesh>
  );
};
