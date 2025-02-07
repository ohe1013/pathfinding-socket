import useInfo from "@/store/info";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GuestBook } from "./GuestBook";
import Game from "./Game";
import { List } from "./List";
type GLTFResult = {
  nodes: {
    [key: string]: THREE.Mesh; // 모든 노드가 THREE.Mesh라고 가정
  };
  materials: {
    [key: string]: THREE.Material; // 모든 소재가 THREE.Material이라고 가정
  };
};

export function Tablet(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Tablet2.glb"
  ) as unknown as GLTFResult;
  const setInfoState = useInfo((state) => state.setState);
  const info = useInfo((state) => state.state);
  const onClose = () => {
    setInfoState({ ...info, situation: "room" });
  };
  const onBack = () => {
    setId("");
  };
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree(); // 카메라와 렌더러 가져오기

  const [id, setId] = useState("");

  useEffect(() => {
    if (meshRef.current) {
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);

      // 화면 좌표 계산
      const canvas = gl.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // NDC(정규화된 장치 좌표)로 변환
      worldPosition.project(camera);

      // 화면 좌표로 변환
      const screenX = (worldPosition.x * 0.5 + 0.5) * width;
      const screenY = (1 - (worldPosition.y * 0.5 + 0.5)) * height;

      console.log("Screen Position:", { x: screenX, y: screenY });
    }
  }, [camera, gl]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.ChamferBox003.geometry}
        material={materials["04___Default"]}
      />
      <mesh
        geometry={nodes.ChamferCyl001.geometry}
        material={materials["03___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox001_1.geometry}
        material={materials["02___Default"]}
      ></mesh>
      <mesh
        geometry={nodes.ChamferBox001_1_1.geometry}
        material={materials["01___Default"]}
      ></mesh>
      <mesh
        geometry={nodes.ChamferBox001_1_2.geometry}
        material={materials["04___Default"]}
      />
      <mesh
        ref={meshRef}
        onClick={onClose}
        geometry={nodes.ChamferBox002_1.geometry}
        material={materials["01___Default"]}
      >
        {id === "game" && <Game onClose={onBack} />}
        {id === "guestbook" && <GuestBook onClose={onBack} />}
        {id === "" && <List onSelect={setId} onClose={onClose} />}
      </mesh>
      <mesh
        onClick={onClose}
        geometry={nodes.ChamferBox002_1_1.geometry}
        material={materials["04___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox004_1.geometry}
        material={materials["01___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox004_1_1.geometry}
        material={materials["04___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox005_1.geometry}
        material={materials["01___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox005_1_1.geometry}
        material={materials["04___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox006_1.geometry}
        material={materials["03___Default"]}
      />
      <mesh
        geometry={nodes.ChamferBox006_1_1.geometry}
        material={materials["04___Default"]}
      />
    </group>
  );
}

useGLTF.preload("/models/Tablet2.glb");
