import useMapStore from "@/store/map";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
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
  const { scene, animations } = useGLTF(`/models/items/${name}.glb`, true);
  const objectRef = useRef(null);
  const animation = useGLTF(`/animations/aerobic.glb`);
  const actions = useAnimations(animation.animations, objectRef);
  useEffect(() => {
    if ((name === "woman" || name === "man") && actions) {
      console.log(animations);
      const action =
        actions.actions["aerobic-dance_315220|A|aerobic-dance_315220"];
      if (action) {
        const targetFPS = 0.1; // 목표 프레임 속도
        const clipDuration = action._clip.duration; // 애니메이션 클립의 총 길이(초 단위)

        // timeScale을 목표 FPS에 맞게 설정
        const timeScale = targetFPS / (1 / clipDuration);
        action.reset().fadeIn(0.1).play();
        action.timeScale = timeScale;

        console.log("Calculated timeScale:", timeScale, "Action:", action);
      } else {
        console.error("애니메이션을 찾을 수 없습니다.");
      }
    }
  }, [actions, name]);
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
        ref={objectRef}
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
