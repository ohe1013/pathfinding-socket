import { Html, useFont, useTexture } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Suspense, useRef } from "react";
// import { LobbyAvatar } from "./LobbyAvatar";
// import { Skyscraper } from "./Skyscraper";
let firstLoad = true;
export const Lobby = () => {
  const isMobile = window.innerWidth < 1024;

  const tablet = useRef(null);

  const goldenRatio = Math.min(1, window.innerWidth / 1600);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // ugly safari fix as transform position is buggy on it
  const backgroundTexture = useTexture("images/bg3.jpg"); // 경로를 적절히 변경

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
        {/* <Tablet scale={0.03} rotation-x={Math.PI / 2} /> */}
        {/* <Html position={[0, 5, 0.11]} transform={!isSafari} center scale={0.121}>
          <div
            className={`${
              isSafari ? "w-[310px] h-[200px] lg:w-[390px] lg:h-[200px]" : "w-[390px] h-[200px]"
            }  max-w-full  overflow-hidden p-5  place-items-center pointer-events-none select-none`}
          >
            <div className="w-full overflow-hidden flex flex-col space-y-2">
              <h1 className="text-center text-white text-xl font-bold">결혼식 미리보기</h1>
            </div>
          </div>
        </Html> */}
      </motion.group>

      {/* <Skyscraper scale={1.32} />
        <Skyscraper scale={1} position-x={-3} position-z={-1} />
        <Skyscraper scale={0.8} position-x={3} position-z={-0.5} /> */}
      {/* {accumulativeShadows} */}
      <Suspense>
        {/* <LobbyAvatar
          position-z={-1}
          position-x={0.5 * goldenRatio}
          position-y={isMobile ? -0.4 : 0}
          rotation-y={-Math.PI / 8}
        /> */}
        <mesh
          position-z={-1}
          position-x={0}
          position-y={isMobile ? -0.4 : 0}
          rotation-x={-Math.PI / 2}
          // rotation-z={-Math.PI / 2}
          scale={[5, 7, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial transparent={true} map={backgroundTexture} />
        </mesh>
      </Suspense>
    </group>
  );
};

useFont.preload("/fonts/Inter_Bold.json");
