import useCharactersStore from "@/store/characters";
import useMapStore from "@/store/map";
import useUserStore from "@/store/user";
import { useEffect } from "react";
import { io } from "socket.io-client";
export const socket = io("http://localhost:3009");

export const SocketManager = () => {
  const mapStore = useMapStore();
  const charStore = useCharactersStore();
  const userStore = useUserStore();
  function setConn(item) {
    mapStore.setState(item.map);
    userStore.setState(item.id);
    charStore.setState(item.characters);
  }
  function setPlayMove(item) {
    charStore.setState(
      charStore.state?.map((char) => {
        if (char.id === item.id) {
          return item;
        } else {
          return char;
        }
      })
    );
  }
  function setCharacters(item) {
    charStore.setState(item);
  }
  useEffect(() => {
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
  }, [setConn, setPlayMove, setCharacters]);
};
