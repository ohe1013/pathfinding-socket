import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { GLTF, SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGrid } from "@/hooks/useGrid";
import useMapStore from "@/store/map";
import { socket } from "../SocketManager";
import { push, ref, set } from "firebase/database";
import { realtimeDb } from "@/firebase/firebase";
// GLTF 타입 정의
type GLTFResult = GLTF & {
  nodes: {
    _rootJoint: THREE.Bone;
    body: THREE.SkinnedMesh;
    eye: THREE.SkinnedMesh;
    "hand-": THREE.SkinnedMesh;
    leg: THREE.SkinnedMesh;
  };
  materials: {
    Material: THREE.Material;
  };
};

interface CharacterProps {
  position?: THREE.Vector3;
  path?: Array<[number, number, number]>;
  id?: string;
}
export const Fallguy = ({ id, ...props }: CharacterProps) => {
  const group = useRef<Group>(null);
  const map = useMapStore((state) => state.state);
  const [chatMessage, setChatMessage] = useState("");
  const [showChatBubble, setShowChatBubble] = useState(false);
  const position = useMemo(() => props.position, [map?.roomId]);
  const { scene, animations } = useGLTF("/models/Fallguy.glb") as GLTFResult;
  const [animation, setAnimation] = useState("idle");
  const { actions } = useAnimations(animations, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;
  const [path, setPath] = useState<Array<THREE.Vector3>>();
  const grid = useGrid();
  const newMaterial = (materials.Material as THREE.MeshStandardMaterial).clone();
  useEffect(() => {
    if (!grid) return;
    const path: Array<THREE.Vector3> = [];
    props.path?.forEach((gridPosition) => {
      path.push(grid.gridToVector3(gridPosition));
    });
    setPath(path);
  }, [props.path, grid]);

  useEffect(() => {
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(0.1).play();
      return () => {
        action.fadeOut(0.1);
      };
    }
  }, [animation, actions]);
  const postChatMessage = (name: string, chatMessage: string) => {
    const postRef = ref(realtimeDb, "chat");
    const newPostRef = push(postRef);
    set(newPostRef, {
      name: name,
      message: chatMessage,
      timestamp: Date.now(),
    });
  };
  useEffect(() => {
    function onPlayerMove(value: { id: string | undefined; path: [number, number, number][] }) {
      if (value.id === id) {
        const path: THREE.Vector3[] = [];
        value.path.forEach((gridPosition: [number, number, number]) => {
          path.push(grid!.gridToVector3(gridPosition));
        });
        setPath(path);
      }
    }
    let chatMessageBubbleTimeOut: NodeJS.Timeout;
    const TIME_OUT = 5000;
    function onChatMessage(value: {
      id: string | undefined;
      name: string | undefined;
      message: string;
    }) {
      if (value.id === id) {
        setChatMessage(value.name + ": " + value.message);
        clearTimeout(chatMessageBubbleTimeOut);
        postChatMessage(value.name || "", value.message);
        setShowChatBubble(true);
        chatMessageBubbleTimeOut = setTimeout(() => {
          setShowChatBubble(false);
        }, TIME_OUT);
      }
    }
    function onPlayerAnimation(value: {
      id: string | undefined;
      animationName: SetStateAction<string>;
    }) {
      if (value.id === id) {
        setAnimation(value.animationName);
      }
    }
    socket.on("playerAnimation", onPlayerAnimation);
    socket.on("playerMove", onPlayerMove);
    socket.on("playerChatMessage", onChatMessage);
    return () => {
      socket.off("playerAnimation", onPlayerAnimation);
      socket.off("playerMove", onPlayerMove);
      socket.off("playerChatMessage", onChatMessage);
    };
  }, [id]);
  useFrame((_, delta) => {
    if (!group.current) return;

    if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
      // 🌟 Delta 적용하여 속도 일정화
      const speed = 3; // 속도 조절 (1초에 3유닛 이동)
      const direction = group.current.position
        .clone()
        .sub(path[0])
        .normalize()
        .multiplyScalar(speed * delta); // delta 적용!

      group.current.position.sub(direction);
      group.current.lookAt(path[0]);
      setAnimation("run");
    } else if (path?.length) {
      path.shift();
    } else {
      if (animation === "run") {
        setAnimation("idle");
      }
    }
  });

  return (
    <>
      <group
        ref={group}
        {...props}
        position={position}
        scale={0.2}
        dispose={null}
        name={`character-${id}`}
      >
        <Html position-y={7}>
          <div className="w-60 max-w-full">
            <p
              className={`absolute max-w-full text-center break-words  p-2 px-4 -translate-x-1/2 rounded-lg bg-white bg-opacity-40 backdrop-blur-sm text-black transition-opacity duration-500 ${
                showChatBubble ? "" : "opacity-0"
              }`}
            >
              {chatMessage}
            </p>
          </div>
        </Html>
        <group name="Scene">
          <group name="fall_guys">
            <primitive object={nodes._rootJoint} />
            <mesh>
              <skinnedMesh
                name="body"
                geometry={nodes.body.geometry}
                material={newMaterial}
                skeleton={nodes.body.skeleton}
                castShadow
                receiveShadow
              />
              <skinnedMesh
                name="eye"
                geometry={nodes.eye.geometry}
                material={materials.Material}
                skeleton={nodes.eye.skeleton}
                castShadow
                receiveShadow
              />
              <skinnedMesh
                name="hand-"
                geometry={nodes["hand-"].geometry}
                material={newMaterial}
                skeleton={nodes["hand-"].skeleton}
                castShadow
                receiveShadow
              />
              <skinnedMesh
                name="leg"
                geometry={nodes.leg.geometry}
                material={newMaterial}
                skeleton={nodes.leg.skeleton}
                castShadow
                receiveShadow
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
};

// GLB 파일 미리 로드
useGLTF.preload("/models/Fallguy.glb");
