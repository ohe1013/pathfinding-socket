import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { GLTF, SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGrid } from "@/hooks/useGrid";
import useUserStore from "@/store/user";

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
  path?: number[][];
  id?: string;
}

const Fallguy = ({ id, ...props }: CharacterProps) => {
  const group = useRef<Group>(null);
  const { scene, materials, animations } = useGLTF("/models/Fallguy.glb") as GLTFResult;
  const [animation, setAnimation] = useState("idle");
  const { actions } = useAnimations(animations, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as GLTFResult;
  const grid = useGrid();
  const [path, setPath] = useState<[number, number, number]>();
  const user = useUserStore((state) => state.state);
  useEffect(() => {
    const path: [number, number, number] = [];
    props.path?.forEach((gridPosition) => {
      path.push(grid?.gridToVector3(gridPosition as [number, number, number]));
    });
    setPath(path);
  }, [props.path]);

  useEffect(() => {
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(0.24).play();
      return () => {
        action.fadeOut(0.24);
      };
    }
  }, [animation, actions]);
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
      setAnimation("walk");
    } else if (path?.length) {
      path.shift();
    } else {
      setAnimation("walk");
    }
    if (id === user) {
      state.camera.position.x = group.current.position.x + 8;
      state.camera.position.y = group.current.position.y + 8;
      state.camera.position.z = group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }
  });
  return (
    <group name={`character-${id}`} ref={group} scale={0.2} dispose={null} {...props}>
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
  );
};

export default Fallguy;

// GLB 파일 미리 로드
useGLTF.preload("/assets/character.glb");
