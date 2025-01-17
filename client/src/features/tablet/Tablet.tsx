import { realtimeDb } from "@/firebase/firebase";
import useInfo from "@/store/info";
import { Html, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
type GLTFResult = {
  nodes: {
    [key: string]: THREE.Mesh; // 모든 노드가 THREE.Mesh라고 가정
  };
  materials: {
    [key: string]: THREE.Material; // 모든 소재가 THREE.Material이라고 가정
  };
};
interface GuestBookPostForm {
  id?: string;
  name: string;
  password: string;
  content: string;
  timestamp: number;
}
export function Tablet(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Tablet2.glb") as unknown as GLTFResult;
  const setInfoState = useInfo((state) => state.setState);
  const onClick = () => {
    setInfoState({ situation: "room" });
  };
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree(); // 카메라와 렌더러 가져오기

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
  const [posts, setPosts] = useState<GuestBookPostForm[]>([]);
  useEffect(() => {
    const guestBookRef = ref(realtimeDb, "guestbook");
    const q = query(guestBookRef, orderByChild("timestamp"));
    onValue(q, (snapshot) => {
      if (snapshot.exists()) {
        setPosts(
          Object.entries(snapshot.val() as GuestBookPostForm[])
            .map((item) => ({
              id: item[0],
              ...item[1],
            }))
            .reverse()
        );
      } else {
        setPosts([]);
      }
    });
  }, []);
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.ChamferBox003.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferCyl001.geometry} material={materials["03___Default"]} />
      <mesh geometry={nodes.ChamferBox001_1.geometry} material={materials["02___Default"]}>
        <Html
          style={{
            width: "330px",
            height: "406px",
            borderRadius: "3px",
            overflowY: "auto",
            padding: "0",
          }}
          position={[0, 4, 0]}
          rotation-x={Math.PI / -2}
          occlude
        >
          <div
            style={{
              padding: "10px",
              width: "330px",
              height: "432px",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h1 className="text-center text-white text-2xl font-bold">방명록</h1>
            <div
              className={` max-w-full  overflow-y-auto p-5  place-items-center pointer-events-none select-none`}
            >
              <div className="w-full overflow-y-auto flex flex-col space-y-2">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg bg-transparent bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer pointer-events-auto"
                  >
                    <p className="text-uppercase font-bold text-lg">{post.name}</p>
                    <div className="flex items-center gap-2">{post.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Html>
      </mesh>
      <mesh geometry={nodes.ChamferBox001_1_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox001_1_2.geometry} material={materials["04___Default"]} />
      <mesh
        ref={meshRef}
        onClick={onClick}
        geometry={nodes.ChamferBox002_1.geometry}
        material={materials["01___Default"]}
      ></mesh>
      <mesh
        onClick={onClick}
        geometry={nodes.ChamferBox002_1_1.geometry}
        material={materials["04___Default"]}
      />
      <mesh geometry={nodes.ChamferBox004_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox004_1_1.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferBox005_1.geometry} material={materials["01___Default"]} />
      <mesh geometry={nodes.ChamferBox005_1_1.geometry} material={materials["04___Default"]} />
      <mesh geometry={nodes.ChamferBox006_1.geometry} material={materials["03___Default"]} />
      <mesh geometry={nodes.ChamferBox006_1_1.geometry} material={materials["04___Default"]} />
    </group>
  );
}

useGLTF.preload("/models/Tablet2.glb");
