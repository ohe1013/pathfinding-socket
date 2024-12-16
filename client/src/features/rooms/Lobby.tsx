import { AccumulativeShadows, Html, RandomizedLight, Text3D } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Suspense, useMemo, useRef } from "react";
// import { LobbyAvatar } from "./LobbyAvatar";
// import { Skyscraper } from "./Skyscraper";
let firstLoad = true;
export const Lobby = () => {
  const isMobile = window.innerWidth < 1024;

  const tablet = useRef();

  const goldenRatio = Math.min(1, window.innerWidth / 1600);

  const accumulativeShadows = useMemo(
    () => (
      <AccumulativeShadows
        temporal
        frames={30}
        alphaTest={0.85}
        scale={50}
        position={[0, 0, 0]}
        color="pink"
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.55}
          ambient={0.25}
          position={[5, 5, -20]}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-5, 5, -20]}
        />
      </AccumulativeShadows>
    ),
    []
  );
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // ugly safari fix as transform position is buggy on it

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
        {/* <Tablet scale={0.03} rotation-x={Math.PI / 2} /> */}
        <Html position={[0, 0.17, 0.11]} transform={!isSafari} center scale={0.121}>
          <div
            className={`${
              isSafari ? "w-[310px] h-[416px] lg:w-[390px] lg:h-[514px]" : "w-[390px] h-[514px]"
            }  max-w-full  overflow-y-auto p-5  place-items-center pointer-events-none select-none`}
          >
            <div className="w-full overflow-y-auto flex flex-col space-y-2">
              <h1 className="text-center text-white text-2xl font-bold">
                안녕하세요.
                <br />
                현근,은비 결혼식에 오신걸 환영합니다.
              </h1>
              <p className="text-center text-white">Please select a room to relax</p>
            </div>
          </div>
        </Html>
      </motion.group>
      <group position-z={-8} rotation-y={Math.PI / 6}>
        <Text3D
          font={"fonts/Inter_Bold.json"}
          position-z={1}
          size={0.3}
          position-x={-3}
          castShadow
          rotation-y={Math.PI / 8}
          bevelEnabled
          bevelThickness={0.005}
          letterSpacing={0.012}
        >
          HG Eunbi
          <meshStandardMaterial color="pink" />
        </Text3D>

        <Text3D
          font={"fonts/Inter_Bold.json"}
          position-z={2.5}
          size={0.3}
          position-x={-3}
          castShadow
          rotation-y={Math.PI / 8}
          bevelEnabled
          bevelThickness={0.005}
          letterSpacing={0.012}
        >
          Wedding
          <meshStandardMaterial color="pink" />
        </Text3D>
        {/* <Skyscraper scale={1.32} />
        <Skyscraper scale={1} position-x={-3} position-z={-1} />
        <Skyscraper scale={0.8} position-x={3} position-z={-0.5} /> */}
      </group>
      {accumulativeShadows}
      <Suspense>
        {/* <LobbyAvatar
          position-z={-1}
          position-x={0.5 * goldenRatio}
          position-y={isMobile ? -0.4 : 0}
          rotation-y={-Math.PI / 8}
        /> */}
      </Suspense>
    </group>
  );
};

// useFont.preload("/fonts/Inter_Bold.json");
