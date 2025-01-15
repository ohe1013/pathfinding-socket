import { Html } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { useRef, useState } from "react";
import { Tablet } from "../tablet/Tablet";
import useInfo from "@/store/info";
let firstLoad = true;
const GuestTablet = () => {
  const [isFullScreen, setIsFullScreen] = useState(false); // 화면 확장 상태
  const tabletRef = useRef(null);
  const setInfoState = useInfo((state) => state.setState);

  const toggleFullScreen = () => {
    setInfoState({ situation: "room" });
  };

  return (
    <group position-y={-1.5}>
      <motion.group
        ref={tabletRef}
        scale={isFullScreen ? 1 : 0.22} // 전체화면이면 크기 조정
        position-x={0}
        position-y={isFullScreen ? 0 : -0.25} // 위치 조정
        initial={{
          y: firstLoad ? 0.5 : 1.5,
        }}
        animate={{
          y: isFullScreen ? 0 : 1.5,
        }}
        transition={{
          duration: 1,
          delay: 0.5,
        }}
        onAnimationComplete={() => {
          firstLoad = false;
        }}
      >
        {/* 태블릿 모델 */}
        <Tablet scale={isFullScreen ? 1 : 0.3} />

        {/* Html 컨텐츠 */}
        <Html
          position={[0, 0.17, 0.11]}
          transform={false}
          center
          style={{
            position: isFullScreen ? "fixed" : "absolute", // 전체 화면 전환
            top: 0,
            left: 0,
            width: isFullScreen ? "100vw" : "390px",
            height: isFullScreen ? "100vh" : "514px",
            overflow: "hidden",
            backgroundColor: isFullScreen ? "rgba(0,0,0,0.8)" : "transparent", // 전체화면 시 배경색 추가
          }}
        >
          <div className="w-full h-full overflow-y-auto flex flex-col space-y-2">
            {/* 부가 버튼 */}
            <div
              className="absolute top-2 left-2 text-white bg-gray-800 p-2 rounded cursor-pointer z-50"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            </div>

            {/* 태블릿 내부 콘텐츠 */}
            <h1 className="text-center text-white text-2xl font-bold">
              {isFullScreen ? "FULLSCREEN MODE" : "WELCOME TO WAWA MANSION"}
            </h1>
            <p className="text-center text-white">
              {isFullScreen ? "You're in fullscreen mode!" : "Please select a room to relax"}
            </p>
            {/* 방 리스트 */}
            {[...Array(5).keys()].map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-800 bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer"
                onClick={() => console.log(`Room ${index + 1} selected`)}
              >
                <p className="text-lg font-bold">Room {index + 1}</p>
                <p className="text-sm">Details about Room {index + 1}</p>
              </div>
            ))}
          </div>
        </Html>
      </motion.group>
    </group>
  );
};

export default GuestTablet;
