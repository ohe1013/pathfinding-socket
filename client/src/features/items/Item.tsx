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
}) => {
  const { name, gridPosition, size, rotation } = item;
  const map = useMapStore((state) => state.state);
  console.log(name);
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
      if (item.touchEvt.type === "watchPhoto") {
        setInfoState({ situation: "photo" });
      }
    }
  };
  const isVirginRoad = name.includes("virginRoad");
  const isChandlier = name.includes("Chandlier");
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // 최적화 - 텍스처 관리
        const material = child.material;
        if (material) {
          // 기본 맵만 사용하고 불필요한 맵 제거
          material.roughnessMap = null;
          material.metalnessMap = null;
          material.emissiveMap = null;

          // 직접 속성값으로 대체
          material.roughness = 0.8; // 예시: 고정값 적용
          material.metalness = 0.2;
          material.emissive = new THREE.Color(0x000000); // 발광 제거
        }
      }
    });
  }, []);
  if (!map) return null;
  return (
    <group
      position={grid?.gridToVector3([...gridPosition, 0], width, height)}
      position-y={item.positionY ?? 0}
      onClick={onClickEvt}
    >
      <primitive object={clone} rotation-y={((rotation || 0) * Math.PI) / 2}></primitive>
      {isVirginRoad && (
        <spotLight
          position={[0, 5, 0]}
          angle={0.4}
          intensity={1.5} // 밝기 약간 낮춤
          penumbra={0.3}
          castShadow
          shadow-mapSize-width={512} // 그림자 품질 조절
          shadow-mapSize-height={512}
          color={"#ffffe0"}
        />
      )}

      {isChandlier && (
        <pointLight
          position={[0, 3, 0]}
          intensity={1.2} // 밝기 약간 낮춤
          distance={4} // 범위 조정
          decay={2}
          color={"#ffc0cb"}
          castShadow
          shadow-mapSize-width={512} // 그림자 해상도 최적화
          shadow-mapSize-height={512}
        />
      )}
    </group>
  );
};
