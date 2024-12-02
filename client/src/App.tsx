import { Canvas } from "@react-three/fiber";
import { Experience } from "./features/Experience";
import { SocketManager } from "./features/SocketManager";

function App() {
  return (
    <>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach={"background"} args={["#ececec"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
