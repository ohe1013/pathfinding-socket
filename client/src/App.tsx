import { Canvas } from "@react-three/fiber";
import { Experience } from "./features/Experience";
import { SocketManager } from "./features/SocketManager";
import useInfo from "./store/info";
import { PhotoRoom } from "./features/rooms/PhotoRoom";
import { useEffect, useState } from "react";
import { UI } from "./features/UI/UI";
import { ScrollControls, useProgress } from "@react-three/drei";
import useMapStore from "./store/map";

const pexel = (id) => `/images/${id}.JPG`;
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1) },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(2) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(3) },
  // Left
  {
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(4),
  },
  {
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(5),
  },
  {
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(6),
  },
  // Right
  {
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(7),
  },
  {
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(8),
  },
  {
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(9),
  },
];

const roomPage = {
  weddingroom: 0,
} as const;

function App() {
  const [loaded, setLoaded] = useState(false);
  const { situation } = useInfo((state) => state.state);
  const map = useMapStore((state) => state.state);
  const setInfo = useInfo((state) => state.setState);
  const { progress } = useProgress();
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setInfo({ situation: "discovery" });
      }
    });
  }, []);
  useEffect(() => {
    if (progress === 100 && map?.items) {
      setLoaded(true);
    }
  }, [progress]);

  return (
    <>
      <SocketManager />
      {situation === "discovery" ? (
        <>
          <Canvas shadows camera={{ position: [0, 8, 2], fov: 30 }}>
            <color attach="background" args={["#ffffff"]} />
            <ScrollControls pages={roomPage[map?.roomId ?? "weddingroom"]}>
              <Experience loaded={loaded} />
            </ScrollControls>
          </Canvas>
          {loaded && <UI />}
        </>
      ) : (
        <PhotoRoom images={images} />
      )}
    </>
  );
}

export default App;
