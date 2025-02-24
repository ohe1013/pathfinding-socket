import { useFont, useTexture } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Suspense, useEffect, useRef } from "react";
import { FrontalAvatar } from "../characters/FrontalAvatar";
import { useAvatar } from "@/store/avatar";
import { FrontalFallguy } from "../characters/FrontalFallguy";
let firstLoad = true;

export const Lobby = () => {
  const { useUrl, setUrl } = useAvatar();
  const isMobile = window.innerWidth < 1024;

  const tablet = useRef(null);

  const goldenRatio = Math.min(1, window.innerWidth / 1600);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // ugly safari fix as transform position is buggy on it
  const backgroundTexture = useTexture("images/bg3.jpg"); // 경로를 적절히 변경

  useEffect(() => {
    const url = localStorage.getItem("avatarUrl");
    if (url) {
      setUrl(url);
    }
  }, []);

  return (
    <group position-y={0.5}>
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
      ></motion.group>

      <Suspense>
        <mesh position={[0, -0.15, -3.01]} scale={3.5}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial transparent={true} color={"#ff9900"} opacity={0.3} />
        </mesh>
        <mesh
          position={[-0.05, 0, -3]} // 카메라 타겟과 동일하게 조정
          scale={2.5} // 크기는 유지
        >
          <planeGeometry args={[1, 1.4]} />
          <meshBasicMaterial transparent={true} map={backgroundTexture} />
        </mesh>
      </Suspense>
      <Suspense>
        {useUrl ? (
          <FrontalAvatar
            position-z={-8}
            position-x={-1}
            position-y={-3}
            rotation-y={Math.PI / 1.3}
          />
        ) : (
          <FrontalFallguy
            position-z={-10}
            position-x={-1}
            position-y={-3}
            rotation-y={Math.PI / 1.3}
          />
        )}
      </Suspense>
    </group>
  );
};

useFont.preload("/fonts/Inter_Bold.json");
