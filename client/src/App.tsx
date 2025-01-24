import { Canvas } from "@react-three/fiber";
import { Experience } from "./features/Experience";
import { SocketManager } from "./features/SocketManager";
import { useEffect, useState } from "react";
import { UI } from "./features/UI/UI";
import { ScrollControls, useProgress } from "@react-three/drei";
import useMapStore from "./store/map";
import { Loader } from "./features/Loader";
import * as THREE from "three";
import { RoomId } from "./store/rooms";

const roomPage = {
  weddingroom: 0,
  bathroom: 1,
  cosyroom: 2,
  lobby: 3,
  partyroom: 4,
} as Record<RoomId, number>;

function App() {
  const [loaded, setLoaded] = useState(false);
  const map = useMapStore((state) => state.state);
  const mapLoadState = useMapStore((state) => state.loadState);
  const setMapLoadState = useMapStore((state) => state.setLoadState);
  const { progress } = useProgress();
  useEffect(() => {
    console.log(progress, mapLoadState);
    if (progress === 100 && mapLoadState === "success") {
      setLoaded(true);
      setMapLoadState("idle");
    }
  }, [progress, mapLoadState]);

  return (
    <>
      <SocketManager />
      <Canvas
        gl={(canvas) => {
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          // ✨ 디버깅용 텍스처 상태 체크
          console.log("Max Textures:", renderer.capabilities.maxTextures);
          console.log("Max Vertex Textures:", renderer.capabilities.maxVertexTextures);
          return renderer;
        }}
        shadows
        camera={{ position: [0, 8, 2], fov: 30 }}
      >
        <color attach="background" args={["#ffffff"]} />
        <ScrollControls pages={roomPage[map?.roomId ?? "weddingroom"]}>
          <Experience loaded={loaded} />
        </ScrollControls>
      </Canvas>
      <Loader loaded={loaded} />
      {loaded && <UI />}
    </>
  );
}

export default App;
