import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "../SocketManager";
import useMapStore from "@/store/map";
import useInfo from "@/store/info";
import { push, ref, set } from "firebase/database";
import { realtimeDb } from "@/firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import ConfirmModal from "../components/Confirm";
import useModalStore from "@/store/modal";
const animations = [
  { name: "wave", emoji: "👋", label: "인사하기" },
  { name: "dive", emoji: "💃", label: "춤추기" },
  { name: "jump_air", emoji: "🤸", label: "점프하기" },
];
export const UI = () => {
  const map = useMapStore((map) => map.state);
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const [name, setName] = useState<string>(localStorage.getItem("name") || "");
  const [useName, setUseName] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const handleConfirm = () => {
    setInfo({ ...info, situation: "room" });
  };

  const openConfirmModal = () => {
    if (name === "") {
      toast.warn("이름을 입력해주세요.");
      return;
    }
    openModal(`${name}으로 입장하시겠습니까?`, handleConfirm);
  };
  const switchSituation = () => {
    if (info.situation === "lobby") {
      if (useName === false) {
        openConfirmModal();
      } else {
        setInfo({ ...info, situation: "room" });
      }
    } else if (info.situation === "guestbook") {
      setInfo({ ...info, situation: "room" });
    } else {
      setInfo({ ...info, situation: "lobby" });
    }
  };
  const switchMusic = () => {
    if (info.useMusic) {
      setInfo({ ...info, useMusic: false });
    } else {
      setInfo({ ...info, useMusic: true });
    }
  };

  const motionRef = useRef(null);
  const [chatMessage, setChatMessage] = useState("");

  const postChatMessage = (name: string, chatMessage: string) => {
    const postRef = ref(realtimeDb, "chat");
    const newPostRef = push(postRef);
    set(newPostRef, {
      name: name,
      message: chatMessage,
      timestamp: Date.now(),
    });
  };

  const sendChatMessage = () => {
    if (chatMessage.length > 0) {
      socket.emit("chatMessage", chatMessage);
      postChatMessage(name, chatMessage);
      setChatMessage("");
    }
  };

  const login = (value: string) => {
    if (value === "") {
      toast.warn("이름이 없어요.😂");
      return;
    }
    setUseName(true);
    localStorage.setItem("name", value);
  };
  const changeName = () => {
    setUseName(false);
  };

  return (
    <>
      <motion.div
        ref={motionRef}
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
                    login(name);
                  }
                }}
                disabled={useName}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {useName && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={() => changeName()}
                >
                  🛠️
                </button>
              )}
              {!useName && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={() => login(name)}
                >
                  🔑
                </button>
              )}
            </div>
          )}

          {info.situation === "guestbook" && (
            <div className="flex items-center space-x-4 pointer-events-auto">
              {map?.roomId && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={switchSituation}
                >
                  돌아가기
                </button>
              )}
              {map?.roomId && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={switchMusic}
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
                  {!info.useMusic && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-full h-0.5 bg-white rotate-45"></span>
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
          {(info.situation === "lobby" || info.situation === "room") && map?.roomId && (
            <div className="flex items-center space-x-4 pointer-events-auto">
              {map?.roomId && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={switchSituation}
                >
                  {info.situation === "lobby" && "구경가기"}
                  {info.situation === "room" && "로비로가기"}
                </button>
              )}
              {map?.roomId && (
                <button
                  className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={switchMusic}
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
                  {!info.useMusic && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-full h-0.5 bg-white rotate-45"></span>
                    </span>
                  )}
                </button>
              )}
              <AnimationButton triggerAnimation={(name) => socket.emit("animation", name)} />
            </div>
          )}
        </div>
        <ToastContainer></ToastContainer>
        <ConfirmModal />
      </motion.div>
    </>
  );
};
export const AnimationButton = ({
  triggerAnimation,
}: {
  triggerAnimation: (name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 버튼 클릭 시 원형 배치되는 애니메이션
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="p-1 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
      {/* 메인 버튼 (이모지 버튼) */}
      <motion.button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full text-white flex items-center justify-center text-xl shadow-lg"
        whileTap={{ scale: 0.9 }}
      >
        💡
      </motion.button>

      {/* 서브 버튼들 (애니메이션 버튼들) */}
      {animations.map((anim, index) => {
        const angle = (index / animations.length) * Math.PI; // 원형 배치
        return (
          <motion.button
            key={anim.name}
            className="absolute w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl"
            style={{
              left: isOpen ? `${Math.cos(angle) * 80}px` : "0px",
              bottom: isOpen ? `${Math.sin(angle) * 80}px` : "0px",
            }}
            onClick={() => triggerAnimation(anim.name)}
            animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {anim.emoji}
          </motion.button>
        );
      })}
    </div>
  );
};
