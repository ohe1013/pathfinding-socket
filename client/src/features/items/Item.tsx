import useMapStore from "@/store/map";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import { socket } from "../SocketManager";
import { Item as ItemProps } from "@/store/rooms";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import useInfo from "@/store/info";
import { useGrid } from "@/hooks/useGrid";
import * as THREE from "three";
import useUserStore from "@/store/user";
import { RenderSound } from "./Sound";
import { RenderLight } from "./Light";

export const Item = ({ item }: { item: ItemProps }) => {
  const { name, gridPosition, size, rotation } = item;
  const map = useMapStore((state) => state.state);
  const { scene } = useGLTF(`/models/items/${name}.glb`, true);
  const objectRef = useRef<THREE.Object3D>(null);
  const soundRef = useRef<THREE.PositionalAudio>(null); // PositionalAudio 참조
  const animation = useGLTF(`/animations/aerobic.glb`);
  const actions = useAnimations(animation.animations, objectRef);

  useEffect(() => {
    if ((name === "woman" || name === "man") && actions) {
      const action =
        actions.actions["aerobic-dance_315220|A|aerobic-dance_315220"];
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
  const info = useInfo((state) => state.state);
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
        setInfoState({ ...info, situation: item.touchEvt.situation });
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
    if (!character || !objectRef.current) return;

    const characterPosition = new THREE.Vector3();
    const itemPosition = new THREE.Vector3();

    character.getWorldPosition(characterPosition);
    objectRef.current.getWorldPosition(itemPosition);
    if (info.useMusic) {
      if (!soundRef.current.isPlaying) {
        soundRef.current.play();
      }
      const distance = characterPosition.distanceTo(itemPosition);
      const maxDistance = 20;
      const minDistance = 2;
      const volume = Math.max(
        0,
        1 - (distance - minDistance) / (maxDistance - minDistance)
      );

      soundRef.current.setVolume(volume);
    } else {
      soundRef.current.pause();
    }
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
      <RenderLight light={item.light}></RenderLight>
      <RenderSound sound={item.sound} soundRef={soundRef}></RenderSound>
    </group>
  );
};
