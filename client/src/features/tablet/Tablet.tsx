import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
type GLTFResult = {
  nodes: {
    [key: string]: THREE.Mesh; // 모든 노드가 THREE.Mesh라고 가정
  };
  materials: {
    [key: string]: THREE.Material; // 모든 소재가 THREE.Material이라고 가정
  };
};
export function Tablet(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Tablet.glb") as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.ChamferBox003.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferCyl001.geometry} material={materials["03___Default"]} />
      <mesh geometry={nodes.ChamferBox001_1.geometry} material={materials["02___Default"]} />
      <mesh geometry={nodes.ChamferBox001_1_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox001_1_2.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferBox002_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox002_1_1.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferBox004_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox004_1_1.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferBox005_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox005_1_1.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferBox006_1.geometry} material={materials["03___Default"]} />
      <mesh geometry={nodes.ChamferBox006_1_1.geometry} material={materials["04___Default"]} />
    </group>
  );
}

useGLTF.preload("/models/Tablet.glb");
