import { Canvas } from "@react-three/fiber";
import Fallguy from "./features/characters/Fallguy";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3009");

function App() {
  useEffect(() => {
    socket.on("conn", console.log);
    socket.on("characters", console.log);
    return () => {
      socket.off("conn", console.log);
      socket.off("characters", console.log);
    };
  }, []);
  return (
    <>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach={"background"} args={["#ececec"]} />
        <Fallguy position={[0, 0, 0]} />
      </Canvas>
    </>
  );
}

export default App;
