import { Html } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";
import { Tablet } from "../tablet/Tablet";
import useInfo from "@/store/info";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { realtimeDb } from "@/firebase/firebase";
let firstLoad = true;
interface GuestBookPostForm {
  id?: string;
  name: string;
  password: string;
  content: string;
  timestamp: number;
}
const GuestTablet = () => {
  const tablet = useRef(null);
  const isMobile = window.innerWidth < 1024;
  const goldenRatio = Math.min(1, window.innerWidth / 1600);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // ugly safari fix as transform position is buggy on it
  const setInfoState = useInfo((state) => state.setState);
  const [posts, setPosts] = useState<GuestBookPostForm[]>([]);
  const toggleFullScreen = () => {
    setInfoState({ situation: "room" });
  };
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
    <group position-y={-1.5}>
      <motion.group
        ref={tablet}
        scale={isMobile ? 0.18 : 0.22}
        position-x={isMobile ? 0 : -0.25 * goldenRatio}
        position-z={0.5}
        initial={{
          y: firstLoad ? 0.5 : 1.5,
          rotateY: isSafari ? 0 : isMobile ? 0 : Math.PI / 8,
          // removed because of safari issue with transform enabled on HTML
        }}
        animate={{
          y: isMobile ? 1.65 : 1.5,
        }}
        transition={{
          duration: 1,
          delay: 0.5,
        }}
        onAnimationComplete={() => {
          firstLoad = false;
        }}
      >
        <Tablet scale={goldenRatio * 0.2} rotation-x={Math.PI / 2} />
        <Html position={[0, 0.17, 0.11]} transform={!isSafari} center scale={0.121}>
          <div
            className={`${
              isSafari ? "w-[310px] h-[416px] lg:w-[390px] lg:h-[514px]" : "w-[390px] h-[514px]"
            }  max-w-full  overflow-y-auto p-5  place-items-center pointer-events-none select-none`}
          >
            <div className="w-full overflow-y-auto flex flex-col space-y-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-lg bg-slate-800 bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer pointer-events-auto"
                >
                  <p className="text-uppercase font-bold text-lg">{post.name}</p>
                  <div className="flex items-center gap-2">{post.content}</div>
                </div>
              ))}
            </div>
          </div>
        </Html>
      </motion.group>
    </group>
  );
};

export default GuestTablet;
