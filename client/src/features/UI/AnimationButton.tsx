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
    { name: "jump_air", emoji: "🤸", label: "점프하기" },
  ];
  // 버튼 클릭 시 원형 배치되는 애니메이션
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="p-1 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors">
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
