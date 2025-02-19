import { addRank } from "@/hooks/useVote";
import useCharactersStore, { CharactersObj } from "@/store/characters";
import useMapStore, { MapObj } from "@/store/map";
import { RoomId } from "@/store/rooms";
import useUserStore from "@/store/user";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { io } from "socket.io-client";
export const socket = io(
  import.meta.env.DEV
    ? `${window.location.hostname}:3009`
    : "https://pathfinding-socket.onrender.com",
  {
    transports: ["websocket"],
    reconnection: true, // 재연결 활성화
    reconnectionAttempts: 10, // 재연결 시도 횟수
    reconnectionDelay: 1000, // 재연결 간 지연(ms)
  }
);

export const SocketManager = () => {
  const setMapState = useMapStore((state) => state.setState);
  const mapState = useMapStore((state) => state.state);
  const setCharState = useCharactersStore((state) => state.setState);
  const setUserState = useUserStore((state) => state.setState);
  const setMapLoadState = useMapStore((state) => state.setLoadState);
  // const cache = useRef<{ [key: string]: GLTF }>({});

  useEffect(() => {
    if (!mapState?.items) {
      return;
    }
    setMapLoadState("loading");
    Object.values(mapState.items).forEach((item) => {
      useGLTF.preload(`/models/items/${item.name}.glb`);
    });
    setMapLoadState("success");
  }, [mapState?.items, setMapLoadState]);
  useEffect(() => {
    const onConn = (item: { map: MapObj; id: string; characters: CharactersObj[] }) => {
      setMapState(item.map);
      setUserState(item.id);
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
    function onPlayerRank(name: string, score: number) {
      addRank({ name, score });
    }

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
    socket.on("playerRank", onPlayerRank);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("conn", onConn);
      socket.off("roomJoined", onRoomJoined);
      socket.off("characters", setCharacters);
      socket.off("playerRank", onPlayerRank);
      socket.off("disconnect", onDisconnect);
    };
  }, [setCharState, setMapState, setUserState]);

  return null;
};
