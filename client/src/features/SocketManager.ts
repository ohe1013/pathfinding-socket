import useCharactersStore, { CharactersObj } from "@/store/characters";
import useMapStore, { MapObj } from "@/store/map";
import { RoomId } from "@/store/rooms";
// import useRoomsStore from "@/store/rooms";
import useUserStore from "@/store/user";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { GLTF, GLTFLoader } from "three-stdlib";
export const socket = io("https://pathfinding-socket.onrender.com");

export const SocketManager = () => {
  const setMapState = useMapStore((state) => state.setState);
  const mapState = useMapStore((state) => state.state);
  const setCharState = useCharactersStore((state) => state.setState);
  const setUserState = useUserStore((state) => state.setState);
  const cache = useRef<{ [key: string]: GLTF }>({});

  useEffect(() => {
    if (!mapState?.items) {
      return;
    }
    Object.values(mapState.items).forEach((item) => {
      const loader = new GLTFLoader();
      loader.load(`/models/items/${item.name}.glb`, (gltf) => {
        cache.current[item.name] = gltf; // 캐시에 저장
      });
    });
  }, [mapState?.items]);
  useEffect(() => {
    const onConn = (item: { map: MapObj; id: string; characters: CharactersObj[] }) => {
      setMapState(item.map);
      setUserState(item.id);
      // setCharState(item.characters);
    };
    const onRoomJoined = (item: {
      roomId: RoomId;
      map: MapObj;
      id: string;
      characters: CharactersObj[];
    }) => {
      setMapState(item.map);
      setUserState(item.id);
      setCharState(item.characters);
    };

    const setCharacters = (item: CharactersObj[]) => {
      setCharState(item);
    };
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }
    socket.on("connect", onConnect);
    socket.on("conn", onConn);
    socket.on("roomJoined", onRoomJoined);
    socket.on("characters", setCharacters);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("conn", onConn);
      socket.off("roomJoined", onRoomJoined);
      socket.off("characters", setCharacters);
      socket.off("disconnect", onDisconnect);
    };
  }, [setCharState, setMapState, setUserState]);

  return null;
};
