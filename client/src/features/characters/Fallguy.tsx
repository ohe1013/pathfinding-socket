import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { GLTF, SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGrid } from "@/hooks/useGrid";
import useUserStore from "@/store/user";
import useMapStore from "@/store/map";
import { socket } from "../SocketManager";
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
  console.log(position, group.current?.position);
  const { scene, materials, animations } = useGLTF("/models/Fallguy.glb") as GLTFResult;
  const [animation, setAnimation] = useState("idle");
  const { actions } = useAnimations(animations, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as GLTFResult;
  const [path, setPath] = useState<Array<THREE.Vector3>>();
  const user = useUserStore((state) => state.state);
  const grid = useGrid();
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
      action.reset().fadeIn(0.24).play();
      return () => {
        action.fadeOut(0.24);
      };
    }
  }, [animation, actions]);

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
    let chatMessageBubbleTimeOut: number;
    const TIME_OUT = 5000;
    function onChatMessage(value: { id: string | undefined; message: SetStateAction<string> }) {
      if (value.id === id) {
        setChatMessage(value.message);
        clearTimeout(chatMessageBubbleTimeOut);
        setShowChatBubble(true);
        chatMessageBubbleTimeOut = setTimeout(() => {
          setShowChatBubble(false);
        }, TIME_OUT);
      }
    }

    socket.on("playerMove", onPlayerMove);
    socket.on("playerChatMessage", onChatMessage);
    return () => {
      socket.off("playerMove", onPlayerMove);
      socket.off("playerChatMessage", onChatMessage);
    };
  }, [id]);
  useFrame((state) => {
    if (!group.current) return;
    if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
      const direction = group.current.position
        .clone()
        .sub(path[0])
        .normalize()
        .multiplyScalar(0.032);
      group.current.position.sub(direction);
      group.current.lookAt(path[0]);
      setAnimation("run");
    } else if (path?.length) {
      path.shift();
    } else {
      setAnimation("idle");
    }
    if (id === user) {
      state.camera.position.x = group.current.position.x + 8;
      state.camera.position.y = group.current.position.y + 8;
      state.camera.position.z = group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }
  });
  return (
    <>
      <Html position-y={2}>
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
      <group
        ref={group}
        {...props}
        position={position}
        scale={0.2}
        dispose={null}
        name={`character-${id}`}
      >
        <group name="Scene">
          <group name="fall_guys">
            <primitive object={nodes._rootJoint} />
            <mesh>
              <skinnedMesh
                name="body"
                geometry={nodes.body.geometry}
                material={materials.Material}
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
                material={materials.Material}
                skeleton={nodes["hand-"].skeleton}
                castShadow
                receiveShadow
              />
              <skinnedMesh
                name="leg"
                geometry={nodes.leg.geometry}
                material={materials.Material}
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
