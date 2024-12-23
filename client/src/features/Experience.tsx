import useMapStore from "@/store/map.ts";
import {
  AccumulativeShadows,
  CameraControls,
  Environment,
  Grid,
  RandomizedLight,
  Sky,
  useCursor,
} from "@react-three/drei";
import { Item } from "./items/Item";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import useUserStore from "@/store/user";
import { Fallguy } from "./characters/Fallguy";
import { useGrid } from "@/hooks/useGrid";
import useCharactersStore from "@/store/characters";
import { socket } from "./SocketManager";

export const Experience = ({ loaded }) => {
  const map = useMapStore((state) => state.state);
  const [guardEvt, setGuardEvt] = useState(false);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const characterList = useCharactersStore((state) => state.state);
  const controls = useRef<CameraControls>();
  const grid = useGrid()!;

  const scene = useThree((state) => state.scene);
  const user = useUserStore((state) => state.state);
  useEffect(() => {
    if (!loaded) {
      controls.current?.setPosition(0, 8, 2);
      controls.current?.setTarget(0, 8, 0);
      return;
    }
    if (map?.roomId) {
      controls.current?.setPosition(0, 10, 5);
      controls.current?.setTarget(0, 10, 0);
      return;
    }
  }, [map?.roomId]);

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
      character.position.x + 8,
      character.position.y + 8,
      character.position.z + 8,
      true
    );
  });
  if (!grid) {
    return null;
  }
  const onCharacterMove = (e: ThreeEvent<MouseEvent>) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) return;
    socket.emit("move", grid.vector3ToGrid(character.position), grid.vector3ToGrid(e.point));
  };

  const accumulativeShadows = useMemo(
    () => (
      <AccumulativeShadows
        temporal
        frames={42}
        alphaTest={0.85}
        scale={30}
        position={[0, 0, 0]}
        color="pink"
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.38}
          ambient={0.25}
          position={[15, 5, -20]}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-5, 5, -20]}
        />
      </AccumulativeShadows>
    ),
    [map?.items]
  );
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
      <CameraControls
        ref={controls}
        // disable all mouse buttons
        mouseButtons={{
          left: 0,
          middle: 0,
          right: 0,
          wheel: 0,
        }}
        // disable all touch gestures
        touches={{
          one: 0,
          two: 0,
          three: 0,
        }}
      />
      {/* <Environment preset="sunset" /> */}
      {/* <ambientLight intensity={0} /> */}
      {accumulativeShadows}
      {/* <OrbitControls /> */}
      {map.items.map((item, idx) => (
        <Item
          key={`${item.name}-${idx}`}
          item={item}
          guardEvt={guardEvt}
          setGuardEvt={setGuardEvt}
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
