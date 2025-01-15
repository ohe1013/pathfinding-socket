import useMapStore from "@/store/map.ts";
import { CameraControls, Environment, Sky } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import useUserStore from "@/store/user";
import { Lobby } from "./rooms/Lobby";
import Room from "./rooms/Room";
import useInfo from "@/store/info";
import GuestTablet from "./rooms/GuestTablet";

export const Experience = ({ loaded }: { loaded: boolean }) => {
  const map = useMapStore((state) => state.state);

  const controls = useRef<CameraControls>(null);
  const [zoomLevel, setZoomLevel] = useState(8); // 기본 줌 거리 설정
  const prevDistance = useRef(0); // 이전 두 손가락 사이의 거리
  const { situation } = useInfo((state) => state.state);
  console.log(situation);

  const user = useUserStore((state) => state.state);
  const info = useInfo((state) => state.state);
  useEffect(() => {
    const resetCamera = () => {
      controls.current?.setPosition(0, 10, 5, true); // 위치 초기화
      controls.current?.setTarget(0, 0, 0, true); // 타겟 초기화
    };
    if (!loaded) {
      controls.current?.setPosition(0, 8, 2);
      controls.current?.setTarget(0, 8, 0);
      return;
    }
    if (info.situation === "lobby") {
      resetCamera();
      // controls.current?.setPosition(0, 6, 2);
      // controls.current?.setTarget(0, 6, 0);
      // controls.current?.setPosition(0, 0, 5, true);
      // controls.current?.setTarget(0, 0, 0, true);
      return;
    }
    if (info.situation === "guestbook") {
      resetCamera();
      // controls.current?.setPosition(0, 0, 2, true);
      // controls.current?.setTarget(0, 0, 0, true);
      return;
    }
    if (map?.roomId) {
      controls.current?.setPosition(0, 10, 5);
      controls.current?.setTarget(0, 10, 0);
      return;
    }
  }, [map?.roomId, info.situation]);
  // 마우스 휠 핸들러
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setZoomLevel((prev) => {
        const nextZoom = prev + event.deltaY * 0.01; // 줌 거리 조절
        return Math.min(Math.max(nextZoom, 5), 50); // 최소 5 ~ 최대 50 제한
      });
    };

    // 이벤트 리스너 추가
    window.addEventListener("wheel", handleWheel);

    // 정리(cleanup) 함수
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []); // 한 번만 실행되도록 빈 배열 사용

  useEffect(() => {
    // 핀치 시작 시 거리 계산
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        prevDistance.current = dist; // 거리 저장
      }
    };

    // 핀치 동작 시 줌 레벨 계산
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = getDistance(e.touches[0], e.touches[1]); // 현재 거리
        const scale = dist / prevDistance.current; // 거리 비율 계산
        setZoomLevel((prev) => {
          const nextZoom = prev / scale; // 줌 조절
          return Math.min(Math.max(nextZoom, 5), 50); // 줌 제한
        });
        prevDistance.current = dist; // 현재 거리 저장
      }
    };

    // 핀치 종료 시 초기화
    const onTouchEnd = () => {
      prevDistance.current = 0;
    };

    // 거리 계산 함수
    const getDistance = (touch1: TouchEvent["touches"][0], touch2: TouchEvent["touches"][1]) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy); // 피타고라스 계산
    };

    // 이벤트 리스너 추가
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    // 정리 함수
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
  useFrame(({ scene }) => {
    if (!user) {
      return;
    }

    const character = scene.getObjectByName(`character-${user}`);
    if (!character) {
      return;
    }
    controls.current?.setTarget(character.position.x, 0, character.position.z, true);
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
            <orthographicCamera attach={"shadow-camera"} args={[-10, 10, 10, -10]} far={20 + 2} />
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
      {situation === "room" && <Room />}
      {situation === "lobby" && <Lobby />}
      {situation === "guestbook" && <GuestTablet />}
    </>
  );
};
