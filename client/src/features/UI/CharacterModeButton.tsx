import { useAvatar } from "@/store/avatar";
import useModalStore from "@/store/modal";
import { motion } from "framer-motion";
import { useState } from "react";
export const CharacterModeButton = ({
  triggerAvatar,
}: {
  triggerAvatar: (isUse: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setUrl, url } = useAvatar();
  const openModal = useModalStore((state) => state.openModal);
  const characterMode = [
    {
      name: "avatar",
      emoji: "/images/ready_player_me.webp",
      fn: () => {
        if (url === "") return;
        openModal(`아바타를 꾸미러 갈까요?😁\n 계정없이 쓸 수 있어요!`, () => triggerAvatar(true));
        setIsOpen(false);
      },
    },
    {
      name: "fallguy",
      emoji: "/images/Emoticon_Happy.webp",
      fn: () => {
        openModal(`아바타를 fallguy로 바꿀까요?😁`, () => {
          setUrl("");
          localStorage.setItem("avatarUrl", "");
          setIsOpen(false);
        });
      },
    },
  ];
  // 버튼 클릭 시 원형 배치되는 애니메이션
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative  z-20 p-1 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors">
      {/* 메인 버튼 (이모지 버튼) */}
      <motion.button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-pink-500  shadow-lg flex items-center justify-center text-2xl"
        whileTap={{ scale: 0.9 }}
      >
        {url ? <img src={characterMode[0].emoji} /> : <img src={characterMode[1].emoji} />}
      </motion.button>

      {characterMode.map((mode, index) => {
        const angle = -(index / characterMode.length) * Math.PI; // 원형 배치
        const radius = 60; // 버튼이 퍼질 거리
        return (
          <motion.button
            key={mode.name}
            className="absolute w-12 h-12 rounded-full bg-pink-500 shadow-lg flex items-center justify-center text-2xl"
            style={{
              top: "0", // 💡 버튼과 동일한 위치에서 시작
              left: "0",
              transform: "translate(-100%, -100%)", // 중앙 정렬
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }} // 초기 상태
            animate={{
              x: isOpen ? Math.cos(angle) * radius : 0,
              y: isOpen ? Math.sin(angle) * radius : 0,
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            onClick={mode.fn}
          >
            <img src={mode.emoji} />
          </motion.button>
        );
      })}
    </div>
  );
};
