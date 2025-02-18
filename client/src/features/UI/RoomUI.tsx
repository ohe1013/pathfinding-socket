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
        {/* <button
          className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
          onClick={() => setAvatarMode(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </button> */}
        <CharacterModeButton triggerAvatar={setAvatarMode}></CharacterModeButton>
        <AnimationButton triggerAnimation={(name) => socket.emit("animation", name)} />
      </div>
    </>
  );
};
