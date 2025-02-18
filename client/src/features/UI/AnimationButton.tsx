import { motion } from "framer-motion";
import { useState } from "react";
export const AnimationButton = ({
  triggerAnimation,
}: {
  triggerAnimation: (name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animations = [
    { name: "wave", emoji: "👋", label: "인사하기" },
    { name: "dive", emoji: "💃", label: "춤추기" },
  ];
  // 버튼 클릭 시 원형 배치되는 애니메이션
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative z-10 p-1 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors">
      {/* 메인 버튼 (이모지 버튼) */}
      <motion.button
        onClick={toggleMenu}
        className=" w-12 h-12 rounded-full text-white flex items-center justify-center text-xl shadow-lg"
        whileTap={{ scale: 0.9 }}
      >
        💡
      </motion.button>

      {/* 서브 버튼들 (애니메이션 버튼들) */}
      {animations.map((anim, index) => {
        const angle = -(index / animations.length) * Math.PI; // 원형 배치
        const radius = 60; // 버튼이 퍼질 거리
        return (
          <motion.button
            key={anim.name}
            className="absolute w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl"
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
            onClick={() => triggerAnimation(anim.name)}
          >
            {anim.emoji}
          </motion.button>
        );
      })}
    </div>
  );
};
