import { Canvas } from "@react-three/fiber";
import { Experience } from "./features/Experience";
import { SocketManager } from "./features/SocketManager";
import useInfo from "./store/info";
import { PhotoRoom } from "./features/rooms/PhotoRoom";

function App() {
  const { situation } = useInfo((state) => state.state);
  return (
    <>
      <SocketManager />
      {situation === "discovery" ? (
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
          <color attach={"background"} args={["#ececec"]} />
          <Experience />
        </Canvas>
      ) : (
        <PhotoRoom />
      )}
    </>
  );
}

export default App;
