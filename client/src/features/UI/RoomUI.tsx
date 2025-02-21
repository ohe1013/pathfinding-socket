import useInfo from "@/store/info";
import { socket } from "../SocketManager";
import { AnimationButton } from "./AnimationButton";
import { MusicButton } from "./MusicButton";
import { useState } from "react";
import { ChatSvg } from "../svg/ChatSvg";
import { CharacterModeButton } from "./CharacterModeButton";

interface RoomUIProps {
  setAvatarMode: (mode: boolean) => void;
}

export const RoomUI = (props: RoomUIProps) => {
  const [chatMessage, setChatMessage] = useState("");

  const sendChatMessage = () => {
    if (chatMessage.length > 0) {
      socket.emit("chatMessage", chatMessage);
      setChatMessage("");
    }
  };
  const { setAvatarMode } = props;
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const switchSituation = () => {
    setInfo({ ...info, situation: "lobby" });
  };

  return (
    <>
      <div className="pointer-events-auto p-4 flex items-center space-x-4">
        <input
          type="text"
          className="w-56 border px-5 p-4 h-full rounded-full"
          placeholder="채팅창"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendChatMessage();
            }
          }}
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <button
          className="p-4 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors"
          onClick={sendChatMessage}
        >
          <ChatSvg />
        </button>
      </div>
      <div className="flex items-center space-x-4 pointer-events-auto">
        <button
          className="p-4 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors"
          onClick={switchSituation}
        >
          {info.situation === "lobby" && "구경가기"}
          {info.situation === "room" && "Lobby"}
        </button>
        <MusicButton />
        <CharacterModeButton triggerAvatar={setAvatarMode}></CharacterModeButton>
        <AnimationButton triggerAnimation={(name) => socket.emit("animation", name)} />
      </div>
    </>
  );
};
