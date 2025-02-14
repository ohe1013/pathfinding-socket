import { Html } from "@react-three/drei";
import { PostFormModal } from "./GuestForm";
import { useEffect, useState } from "react";
import { CRUD, GuestBookPostForm } from "@/types";
import { postValidation } from "@/hooks/useForm";
import GuestBookItem from "./GuestBookItem";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { realtimeDb } from "@/firebase/firebase";
const initialPost = {
  password: "",
  name: "",
  content: "",
  timestamp: 0,
};

type GuestBookProps = {
  onClose: () => void;
};

export const GuestBook = ({ onClose }: GuestBookProps) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const handleFormModalClose = () => setIsFormModalOpen(false);
  const [selectedPost, setSelectedPost] = useState<GuestBookPostForm>(initialPost);
  const [type, setType] = useState<CRUD>("insert");
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
  const handleFormModal = (type: CRUD, post?: GuestBookPostForm) => {
    if (type === "insert") {
      setType(type);
      setSelectedPost(initialPost);
    } else if (type === "delete" || type === "update") {
      setType(type);
      if (post) {
        setSelectedPost({ ...post, password: "" });
      }
    }
    setIsFormModalOpen(true);
  };
  return (
    // <Html
    //   style={{
    //     width: "330px",
    //     height: "384px",
    //     borderRadius: "3px",
    //     overflowY: "auto",
    //     padding: "0",
    //     overflowX: "hidden",
    //     // pointerEvents: "auto",
    //   }}
    //   position={[0, 4, -4]}
    //   rotation-x={Math.PI / -2}
    //   occlude
    //   className="scrollbar-hide"
    //   scale={5}
    //   transform
    // >
    //   <div
    //     style={{
    //       width: "330px",
    //       height: "384px",
    //     }}
    //     onPointerDown={(e) => e.stopPropagation()}
    //   >
    <Html
      position={[0, 4, -4]} // ✅ 정확한 위치
      scale={5}
      rotation-x={Math.PI / -2} // ✅ 올바른 방향으로 회전
      style={{
        position: "absolute",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "330px",
          height: "384px",
          borderRadius: "3px",
          overflowY: "auto",
          transform: "translate(-50%, -53%)", // ✅ 중앙 정렬
          position: "relative", // ✅ 내부 요소 위치 보정
        }}
      >
        {!isFormModalOpen && (
          <div className="flex justify-between mx-4">
            <button onClick={onClose}>◀</button>
            <h1 className="text-center text-white text-2xl font-bold">방명록</h1>
            <button
              onClick={() => {
                handleFormModal("insert");
              }}
              className="right-5 top-0"
            >
              📝
            </button>
          </div>
        )}
        {isFormModalOpen && (
          <div className={` max-w-full  overflow-y-auto p-5  place-items-center  select-none`}>
            <PostFormModal
              isOpen={isFormModalOpen}
              onClose={handleFormModalClose}
              onFormValid={postValidation}
              initialValues={selectedPost}
              type={type}
            />
          </div>
        )}
        {!isFormModalOpen && (
          <GuestBookItem posts={posts} onEdit={handleFormModal} onDelete={handleFormModal} />
        )}
      </div>
    </Html>
  );
};
