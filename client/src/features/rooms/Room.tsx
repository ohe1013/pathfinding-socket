import useCharactersStore from "@/store/characters";
import { Grid, useCursor } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { socket } from "../SocketManager";
import useMapStore from "@/store/map";
import { useGrid } from "@/hooks/useGrid";
import { Vector3 } from "three";
import useUserStore from "@/store/user";
import { Item } from "../items/Item";
import { Fallguy } from "../characters/Fallguy";

const Room = () => {
  const map = useMapStore((state) => state.state);

  const characterList = useCharactersStore((state) => state.state);
  const scene = useThree((state) => state.scene);
  const grid = useGrid()!;
  const user = useUserStore((state) => state.state);

  const [guardEvt, setGuardEvt] = useState(false);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const onCharacterMove = (e: ThreeEvent<MouseEvent>) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;
    socket.emit(
      "move",
      grid.vector3ToGrid(character.position),
      grid.vector3ToGrid(e.point)
    );
  };
  const onCharacterMoveToItem = (position: Vector3) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;
    socket.emit(
      "move",
      grid.vector3ToGrid(character.position),
      grid.vector3ToGrid(position)
    );
  };
  if (!map) return null;
  if (!grid) return null;

  return (
    <>
      {map.items.map((item, idx) => (
        <Item
          key={`${item.name}-${idx}`}
          item={item}
          guardEvt={guardEvt}
          setGuardEvt={setGuardEvt}
          onCharacterMoveToItem={onCharacterMoveToItem}
        />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onCharacterMove}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
        receiveShadow
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      {characterList?.map((character) => (
        <Suspense key={character.session + "-" + character.id}>
          <Fallguy
            key={character.id}
            position={grid.gridToVector3(character.position)}
            id={character.id}
            path={character.path}
          />
        </Suspense>
      ))}
    </>
  );
};

export default Room;