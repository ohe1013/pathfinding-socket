import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "../SocketManager";
import useMapStore from "@/store/map";
import useInfo from "@/store/info";

export const UI = () => {
  const map = useMapStore((map) => map.state);
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });

  const handleLogin = () => {
    if (loginInfo.username && loginInfo.password) {
      // 여기에 로그인 처리를 위한 socket 또는 API 호출 로직을 작성
      socket.emit("login", loginInfo);
      console.log("로그인 시도", loginInfo);
      setLoginInfo({ username: "", password: "" });
    } else {
      console.log("아이디와 비밀번호를 입력해주세요!");
    }
  };
  const switchSituation = () => {
    if (info.situation === "lobby") {
      setInfo({ situation: "room" });
    } else {
      setInfo({ situation: "lobby" });
    }
  };

  const ref = useRef(null);
  const [chatMessage, setChatMessage] = useState("");
  const sendChatMessage = () => {
    if (chatMessage.length > 0) {
      socket.emit("chatMessage", chatMessage);
      setChatMessage("");
    }
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="fixed inset-4 flex items-center justify-end flex-col pointer-events-none select-none">
          {info.situation === "room" && map?.roomId && (
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
                className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={sendChatMessage}
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
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          )}
          {info.situation === "lobby" && map?.roomId && (
            <div className="pointer-events-auto p-4 flex items-center space-x-4">
              <input
                type="text"
                className="w-56 border px-5 p-4 h-full rounded-full"
                placeholder="이름"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendChatMessage();
                  }
                }}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button
                className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={sendChatMessage}
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
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          )}

          {info.situation === "room" && (
            <div className="flex items-center space-x-4 pointer-events-auto">
              {map?.roomId && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={switchSituation}
                >
                  '돌아가기'
                </button>
              )}
              {map?.roomId && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={() => socket.emit("dance")}
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
                      d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
