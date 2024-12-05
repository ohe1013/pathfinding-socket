import useMapStore from "@/store/map.ts";
import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";
import { Item } from "./items/Item";
import { useState } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import useUserStore from "@/store/user";
import { Fallguy } from "./characters/Fallguy";
import { useGrid } from "@/hooks/useGrid";
import useCharactersStore from "@/store/characters";
import { socket } from "./SocketManager";

export const Experience = () => {
  const map = useMapStore((state) => state.state);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const characterList = useCharactersStore((state) => state.state);
  const grid = useGrid()!;

  const scene = useThree((state) => state.scene);
  const user = useUserStore((state) => state.state);
  if (!grid) {
    return null;
  }
  const onCharacterMove = (e: ThreeEvent<MouseEvent>) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;
    socket.emit("move", grid.vector3ToGrid(character.position), grid.vector3ToGrid(e.point));
  };

  if (!map) return null;
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={1} />
      <OrbitControls />
      {map.items.map((item, idx) => (
        <Item key={`${item.name}-${idx}`} item={item} />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onCharacterMove}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      {characterList?.map((character) => (
        <Fallguy
          key={character.id}
          position={grid.gridToVector3(character.position)}
          id={character.id}
          path={character.path}
        />
      ))}
    </>
  );
};
