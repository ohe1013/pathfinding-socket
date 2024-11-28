import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { GLTF, SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useGraph } from "@react-three/fiber";

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
  position?: [number, number, number];
  path?: number[][];
}

const Fallguy = ({ ...props }: CharacterProps) => {
  const group = useRef<Group>(null);
  const { scene, materials, animations } = useGLTF("/models/Fallguy.glb") as GLTFResult;
  const [animation, setAnimation] = useState("idle");
  const { actions } = useAnimations(animations, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as GLTFResult;

  useEffect(() => {
    const action = actions[animation];
    if (action) {
      action.reset().fadeIn(0.24).play();
      return () => {
        action.fadeOut(0.24);
      };
    }
  }, [animation, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
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
