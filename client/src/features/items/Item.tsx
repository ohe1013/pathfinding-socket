import useMapStore from "@/store/map";
import { PositionalAudio, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import { socket } from "../SocketManager";
import { Item as ItemProps } from "@/store/rooms";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import useInfo from "@/store/info";
import { useGrid } from "@/hooks/useGrid";
import * as THREE from "three";
import useUserStore from "@/store/user";

export const Item = ({
  item,
  guardEvt,
  setGuardEvt,
  onCharacterMoveToItem,
}: {
  item: ItemProps;
  guardEvt: boolean;
  setGuardEvt: (item: boolean) => void;
  onCharacterMoveToItem: (position: THREE.Vector3) => void;
}) => {
  const { name, gridPosition, size, rotation } = item;
  const map = useMapStore((state) => state.state);
  const { scene, animations } = useGLTF(`/models/items/${name}.glb`, true);
  const objectRef = useRef<THREE.Object3D>(null);
  const soundRef = useRef<THREE.PositionalAudio>(null); // PositionalAudio 참조
  const animation = useGLTF(`/animations/aerobic.glb`);
  const actions = useAnimations(animation.animations, objectRef);

  useEffect(() => {
    if ((name === "woman" || name === "man") && actions) {
      console.log(animations);
      const action = actions.actions["aerobic-dance_315220|A|aerobic-dance_315220"];
      if (action) {
        const targetFPS = 0.1; // 목표 프레임 속도
        const clipDuration = action.getClip().duration; // 애니메이션 클립의 총 길이(초 단위)

        const timeScale = targetFPS / (1 / clipDuration);
        action.reset().fadeIn(0.1).play();
        action.timeScale = timeScale;
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
  const user = useUserStore((state) => state.state);

  const onClickEvt = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (item.touchEvt) {
      if (item.touchEvt.type === "switchRoom") {
        socket.emit("joinRoom", item.touchEvt.roomId, {
          position: item.touchEvt.position,
        });
      }
      if (item.touchEvt.type === "switchSituation") {
        setInfoState({ situation: item.touchEvt.situation });
      }
    }
  };

  useEffect(() => {
    clone.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [clone]);

  useFrame(({ scene }) => {
    if (!user || !soundRef.current) return;

    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;

    const characterPosition = new THREE.Vector3();
    const itemPosition = new THREE.Vector3();

    character.getWorldPosition(characterPosition);
    objectRef.current?.getWorldPosition(itemPosition);

    // 거리 계산
    const distance = characterPosition.distanceTo(itemPosition);

    // 볼륨 계산 (0 ~ 1)
    const maxDistance = 20; // 소리가 완전히 사라지는 거리
    const minDistance = 2; // 최대 볼륨이 유지되는 거리
    const volume = Math.max(0, 1 - (distance - minDistance) / (maxDistance - minDistance));

    // PositionalAudio 볼륨 조정
    soundRef.current.setVolume(volume);
  });

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
      {renderSound(item, soundRef)}
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

const renderSound = (item: ItemProps, soundRef: React.RefObject<THREE.PositionalAudio>) => {
  if (item.sound) {
    return (
      <PositionalAudio
        ref={soundRef}
        url={"./musics/fire_work.mp3"}
        distance={20}
        loop={true}
        autoplay={true}
      />
    );
  }
};
