import { Html } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";
import { Tablet } from "../tablet/Tablet";
import useInfo from "@/store/info";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { realtimeDb } from "@/firebase/firebase";
import { useThree } from "@react-three/fiber";
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
  const { camera, size } = useThree(); // 카메라와 화면 크기 정보
  const [tabletScale, setTabletScale] = useState(1); // Tablet 크기
  const [tabletPosition, setTabletPosition] = useState([0, 0, 0]); // Tablet 위치

  useEffect(() => {
    const updateTabletSizeAndPosition = () => {
      const fov = camera.fov; // 카메라의 시야각(FOV)
      const aspect = size.width / size.height; // 화면 비율

      // 화면 높이에 따른 스케일 계산 (FOV를 사용)
      const height = 2 * Math.tan((fov * Math.PI) / 360) * camera.position.z;
      const scale = size.width / size.height < 1 ? height : height * aspect; // 세로 비율 조정
      setTabletScale(scale / 3); // 적절한 비율로 조정

      // Tablet이 화면 중앙에 위치하도록 Z축으로 조정
      setTabletPosition([0, -2, camera.position.z - 1]);
      console.log(scale, tabletPosition);
    };

    updateTabletSizeAndPosition(); // 초기 업데이트
    window.addEventListener("resize", updateTabletSizeAndPosition); // 리사이즈 시 업데이트

    return () => window.removeEventListener("resize", updateTabletSizeAndPosition);
  }, [camera, size]);

  return (
    <Tablet position={[0, 0, 0]} scale={0.01} rotation-x={Math.PI / 2} />
    // <group position-y={-1.5}>
    //   <motion.group
    //     ref={tablet}
    //     scale={isMobile ? 0.18 : 0.22}
    //     position-x={isMobile ? 0 : -0.25 * goldenRatio}
    //     position-z={-1}
    //     initial={{
    //       y: firstLoad ? 0.5 : 1.5,
    //       rotateY: isSafari ? 0 : isMobile ? 0 : Math.PI / 8,
    //       // removed because of safari issue with transform enabled on HTML
    //     }}
    //     animate={{
    //       y: isMobile ? 1.65 : 1.5,
    //     }}
    //     transition={{
    //       duration: 1,
    //       delay: 0.5,
    //     }}
    //     onAnimationComplete={() => {
    //       firstLoad = false;
    //     }}
    //   >

    //   </motion.group>
    // </group>
  );
};

export default GuestTablet;
