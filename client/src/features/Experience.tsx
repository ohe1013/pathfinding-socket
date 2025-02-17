import useMapStore from "@/store/map.ts";
import {
  CameraControls,
  Environment,
  OrbitControls,
  OrthographicCamera,
  Sky,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import useUserStore from "@/store/user";
import { Lobby } from "./rooms/Lobby";
import Room from "./rooms/Room";
import useInfo from "@/store/info";
import GuestTablet from "./rooms/GuestTablet";
import { Gallery } from "./gallery/Gallery";

export const Experience = ({ loaded }: { loaded: boolean }) => {
  const map = useMapStore((state) => state.state);
  const controls = useRef<CameraControls>(null);
  const [zoomLevel, setZoomLevel] = useState(8); // 기본 줌 거리 설정
  const prevDistance = useRef(0); // 이전 두 손가락 사이의 거리
  const { situation } = useInfo((state) => state.state);
  const user = useUserStore((state) => state.state);

  useEffect(() => {
    if (!controls.current) return;

    // 📌 카메라 위치 초기화 함수
    const resetCamera = (position: [number, number, number], target: [number, number, number]) => {
      controls.current?.setPosition(...position, true);
      controls.current?.setTarget(...target, true);
    };

    if (!loaded) {
      resetCamera([0, 8, 2], [0, 8, 0]);
      return;
    }

    switch (situation) {
      case "lobby":
      case "guestbook":
        resetCamera([0, 0, 2], [0, 0, 0]);
        break;
      case "gallery":
        resetCamera([0, 10, 10], [0, 10, 0]); // 🎯 갤러리 카메라 위치 추가
        break;
      case "room":
        if (map?.roomId) {
          resetCamera([0, 10, 5], [0, 10, 0]);
        }
        break;
    }
  }, [map?.roomId, situation, loaded]);

  // 마우스 휠 핸들러 (줌 기능)
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setZoomLevel((prev) => Math.min(Math.max(prev + event.deltaY * 0.01, 5), 50));
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // 터치 핀치 줌
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        prevDistance.current = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        const scale = dist / prevDistance.current;
        setZoomLevel((prev) => Math.min(Math.max(prev / scale, 5), 50));
        prevDistance.current = dist;
      }
    };

    const getDistance = (touch1: Touch, touch2: Touch) => {
      return Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // 📌 캐릭터를 따라다니는 카메라
  useFrame(({ scene }) => {
    if (!user || !controls.current) return;
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;

    controls.current.setTarget(character.position.x, 0, character.position.z, true);
    controls.current.setPosition(
      character.position.x + zoomLevel,
      character.position.y + zoomLevel,
      character.position.z + zoomLevel,
      true
    );
  });

  if (!map || !loaded) return null;

  return (
    <>
      {situation === "lobby" && (
        <>
          <Environment files={"/textures/venice_sunset_1k.hdr"} />
          <ambientLight intensity={0.1} />
          <directionalLight position={[4, 4, -4]} castShadow intensity={0.35}>
            <OrbitControls />
          </directionalLight>
          <Sky
            distance={450000}
            sunPosition={[5, 8, 20]}
            inclination={0}
            azimuth={0.25}
            rayleigh={0.1}
          />
        </>
      )}

      {/* 환경 조명 */}
      {situation === "room" && map.roomId === "weddingroom" && <ambientLight intensity={0.5} />}
      {situation === "guestbook" && (
        <>
          <Environment files={"/textures/venice_sunset_1k.hdr"} />
          <ambientLight intensity={0.1} />
          <directionalLight position={[4, 4, -4]} castShadow intensity={0.35}>
            <OrbitControls />
          </directionalLight>
        </>
      )}
      {situation !== "gallery" && situation !== "guestbook" && map.roomId !== "weddingroom" && (
        <>
          <Environment files={"/textures/venice_sunset_1k.hdr"} />
          <ambientLight intensity={0.1} />

          <directionalLight position={[4, 4, -4]} castShadow intensity={0.35}>
            <orthographicCamera attach={"shadow-camera"} args={[-10, 10, 10, -10]} far={22} />
          </directionalLight>
        </>
      )}
      {situation === "gallery" && (
        <>
          <Environment files={"/textures/venice_sunset_1k.hdr"} />
          <ambientLight intensity={0.1} />
          <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
        </>
      )}

      {/* 📌 카메라 컨트롤 */}
      <CameraControls
        ref={controls}
        dollySpeed={2}
        minDistance={10}
        maxDistance={200}
        mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
        touches={{ one: 0, two: 0, three: 0 }}
      />

      {/* 각 상황별 렌더링 */}
      {situation === "room" && <Room />}
      {situation === "lobby" && <Lobby />}
      {situation === "guestbook" && <GuestTablet />}
      {situation === "gallery" && <Gallery />}
    </>
  );
};
