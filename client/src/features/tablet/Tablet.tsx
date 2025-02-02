import { realtimeDb } from "@/firebase/firebase";
import useInfo from "@/store/info";
import { Html, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Guestbook from "./Guestbook";
import { PostFormModal } from "./GuestForm";
import { postValidation } from "@/hooks/useForm";
import { CRUD } from "@/types";
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

const initialPost = {
  id: "",
  password: "",
  name: "",
  content: "",
  timestamp: 0,
};

export function Tablet(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Tablet2.glb"
  ) as unknown as GLTFResult;
  const setInfoState = useInfo((state) => state.setState);
  const info = useInfo((state) => state.state);
  const onClick = () => {
    setInfoState({ ...info, situation: "room" });
  };
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree(); // 카메라와 렌더러 가져오기
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const handleFormModalClose = () => setIsFormModalOpen(false);
  const [selectedPost, setSelectedPost] =
    useState<GuestBookPostForm>(initialPost);
  const [type, setType] = useState<CRUD>("insert");

  const handleFormModal = (type: CRUD, post?: GuestBookPostForm) => {
    if (type === "insert") {
      setType(type);
      setSelectedPost(initialPost);
    } else if (type === "delete" || type === "update") {
      setType(type);
      setSelectedPost(post!);
    }
  };

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
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setInfoState({ ...info, situation: "room" });
      }
    });
  });
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
        onClick={onClick}
        geometry={nodes.ChamferBox002_1.geometry}
        material={materials["01___Default"]}
      >
        <Html
          style={{
            width: "330px",
            height: "384px",
            borderRadius: "3px",
            overflowY: "auto",
            padding: "0",
            overflowX: "hidden",
            // pointerEvents: "auto",
          }}
          position={[0, 4, -4]}
          rotation-x={Math.PI / -2}
          occlude
          className="scrollbar-hide"
          scale={5}
          transform
        >
          <div
            style={{
              width: "330px",
              height: "384px",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {!isFormModalOpen && (
              <h1 className="text-center text-white text-2xl font-bold">
                방명록
              </h1>
            )}
            {!isFormModalOpen && (
              <button
                onClick={() => {
                  setIsFormModalOpen(true);
                  handleFormModal("insert");
                }}
                className="absolute right-5 top-0"
              >
                글쓰기
              </button>
            )}
            <div
              className={` max-w-full  overflow-y-auto p-5  place-items-center  select-none`}
            >
              <PostFormModal
                isOpen={isFormModalOpen}
                onClose={handleFormModalClose}
                onFormValid={postValidation}
                initialValues={selectedPost}
                type={type}
              />
            </div>
            {!isFormModalOpen && <Guestbook posts={posts} />}
          </div>
        </Html>
      </mesh>
      <mesh
        onClick={onClick}
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
