import useMapStore from "@/store/map.ts";
import { CameraControls, Environment, Sky } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import useUserStore from "@/store/user";
import { useGesture } from "@use-gesture/react";
import { Lobby } from "./rooms/Lobby";
import Room from "./rooms/Room";
import useInfo from "@/store/info";

export const Experience = ({ loaded }: { loaded: boolean }) => {
  const map = useMapStore((state) => state.state);

  const controls = useRef<CameraControls>(null);
  const [zoomLevel, setZoomLevel] = useState(8); // 기본 줌 거리 설정
  const { situation } = useInfo((state) => state.state);

  const user = useUserStore((state) => state.state);
  const info = useInfo((state) => state.state);
  useEffect(() => {
    if (!loaded) {
      controls.current?.setPosition(0, 8, 2);
      controls.current?.setTarget(0, 8, 0);
      return;
    }
    if (info.situation === "lobby") {
      controls.current?.setPosition(0, 6, 2);
      controls.current?.setTarget(0, 6, 0);
      controls.current?.setPosition(0, 0, 5, true);
      controls.current?.setTarget(0, 0, 0, true);
      return;
    }
    if (map?.roomId) {
      controls.current?.setPosition(0, 10, 5);
      controls.current?.setTarget(0, 10, 0);
      return;
    }
  }, [map?.roomId, info.situation]);
  // 마우스 휠 핸들러
  // useEffect(() => {
  //   const handleWheel = (event: WheelEvent) => {
  //     setZoomLevel((prev) => {
  //       const nextZoom = prev + event.deltaY * 0.01; // 줌 거리 조절
  //       return Math.min(Math.max(nextZoom, 5), 50); // 최소 5 ~ 최대 50 제한
  //     });
  //   };

  //   // 이벤트 리스너 추가
  //   window.addEventListener("wheel", handleWheel);

  //   // 정리(cleanup) 함수
  //   return () => {
  //     window.removeEventListener("wheel", handleWheel);
  //   };
  // }, []); // 한 번만 실행되도록 빈 배열 사용
  useGesture(
    {
      // 휠 스크롤 이벤트 처리
      onWheel: ({ delta: [, dy] }) => {
        setZoomLevel((prev) => {
          // console.log(prev);
          const nextZoom = prev + dy * 0.01; // 휠 줌 비율
          return Math.min(Math.max(nextZoom, 5), 50); // 줌 범위 제한
        });
      },

      // 터치 핀치 이벤트 처리
      onPinch: ({ offset: [d] }) => {
        setZoomLevel((prev) => {
          const nextZoom = prev - d * 0.02; // 핀치 줌 비율
          return Math.min(Math.max(nextZoom, 5), 50);
        });
      },
    },
    {
      target: window, // 🌟 타겟을 Canvas로 변경!
      eventOptions: { passive: false }, // 기본 동작 차단
    }
  );
  useFrame(({ scene }) => {
    if (!user) {
      return;
    }

    const character = scene.getObjectByName(`character-${user}`);
    if (!character) {
      return;
    }
    controls.current?.setTarget(
      character.position.x,
      0,
      character.position.z,
      true
    );
    controls.current?.setPosition(
      character.position.x + zoomLevel,
      character.position.y + zoomLevel,
      character.position.z + zoomLevel,
      true
    );
  });

  if (!map) return null;
  if (!loaded) return null;
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[5, 8, 20]}
        inclination={0}
        azimuth={0.25}
        rayleigh={0.1}
      />
      {map.roomId !== "weddingroom" ? (
        <>
          <Environment files={"/textures/venice_sunset_1k.hdr"} />
          <ambientLight intensity={0.1} />
          <directionalLight
            position={[4, 4, -4]}
            castShadow
            intensity={0.35}
            shadow-mapSize={[1024, 1024]}
          >
            <orthographicCamera
              attach={"shadow-camera"}
              args={[-10, 10, 10, -10]}
              far={20 + 2}
            />
          </directionalLight>
        </>
      ) : (
        <ambientLight intensity={0.5} />
      )}
      <CameraControls
        ref={controls}
        dollySpeed={2} // 줌 속도   조절
        minDistance={10} // 최소 거리 제한
        maxDistance={200} // 최대 거리 제한
        mouseButtons={{
          left: 0,
          middle: 0,
          right: 0,
          wheel: 0, // 스크롤을 Dolly(거리 줌)로 설정
        }}
        touches={{
          one: 0,
          two: 0, // 핀치 줌을 Dolly로 설정
          three: 0,
        }}
      />
      {situation === "room" ? <Room /> : <Lobby />}
      {/* <Lobby /> */}
    </>
  );
};
