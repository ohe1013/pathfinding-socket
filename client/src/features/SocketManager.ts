import useCharactersStore, { CharactersObj } from "@/store/characters";
import useMapStore, { MapObj } from "@/store/map";
import useUserStore from "@/store/user";
import { useEffect } from "react";
import { io } from "socket.io-client";
export const socket = io("http://localhost:3009");

export const SocketManager = () => {
  const setMapState = useMapStore((state) => state.setState);
  const setCharState = useCharactersStore((state) => state.setState);
  const setCharStateWithFilter = useCharactersStore((state) => state.setStateWithFilter);
  const setUserState = useUserStore((state) => state.setState);

  useEffect(() => {
    const setConn = (item: { map: MapObj; id: string; characters: CharactersObj[] }) => {
      setMapState(item.map);
      setUserState(item.id);
      setCharState(item.characters);
    };

    const setplayerMove = (item: CharactersObj) => {
      setCharStateWithFilter(item);
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
    socket.on("conn", setConn);
    socket.on("playerMove", setplayerMove);
    socket.on("characters", setCharacters);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("conn", setConn);
      socket.off("playerMove", setplayerMove);
      socket.off("characters", setCharacters);
      socket.off("disconnect", onDisconnect);
    };
  }, [setCharState, setCharStateWithFilter, setMapState, setUserState]);

  return null;
};
