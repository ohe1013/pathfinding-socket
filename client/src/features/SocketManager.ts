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
  console.log("it render?");

  useEffect(() => {
    const setConn = (item: { map: MapObj; id: string; characters: CharactersObj[] }) => {
      setMapState(item.map);
      setUserState({ id: item.id });
      setCharState(item.characters);
    };

    const setPlayMove = (item: CharactersObj) => {
      setCharStateWithFilter(item);
    };
    const setCharacters = (item: CharactersObj) => {
      setCharStateWithFilter(item);
    };
    socket.on("conn", setConn);
    socket.on("playMove", setPlayMove);
    socket.on("characters", setCharacters);
    console.log("effetct");
    return () => {
      console.log("return effetct");
      socket.off("conn", setConn);
      socket.off("playMove", setPlayMove);
      socket.off("characters", setCharacters);
    };
  }, [setCharState, setCharStateWithFilter, setMapState, setUserState]);

  return null;
};
