// import { Html } from "@react-three/drei";
// import { useEffect, useRef, useState } from "react";
// import clsx from "clsx";

// type GuestBookProps = {
//   onClose: () => void;
// };

// const Game = ({ onClose }: GuestBookProps) => {
//   const [playerX, setPlayerX] = useState(150);
//   const [playerY, setPlayerY] = useState(354);
//   const [score, setScore] = useState(0);
//   const [spawnInterval, setSpawnInterval] = useState(1000);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const gameRef = useRef<HTMLDivElement>(null);
//   const bulletsRef = useRef<{ id: number; x: number; y: number }[]>([]);
//   let bulletId = 0;

//   const movePlayer = (dx: number, dy: number) => {
//     setPlayerX((prevX) => Math.max(0, Math.min(300, prevX + dx)));
//     setPlayerY((prevY) => Math.max(0, Math.min(354, prevY + dy)));
//   };

//   useEffect(() => {
//     if (isGameOver) return;

//     const spawnBullet = () => {
//       bulletId++;
//       const side = Math.floor(Math.random() * 4);
//       let posX = 0,
//         posY = 0,
//         speedX = 0,
//         speedY = 0;

//       if (side === 0) {
//         posX = Math.random() * 315;
//         posY = -15;
//         speedY = 2;
//       } else if (side === 1) {
//         posX = Math.random() * 315;
//         posY = 384;
//         speedY = -2;
//       } else if (side === 2) {
//         posX = -15;
//         posY = Math.random() * 369;
//         speedX = 2;
//       } else {
//         posX = 330;
//         posY = Math.random() * 369;
//         speedX = -2;
//       }

//       bulletsRef.current.push({ id: bulletId, x: posX, y: posY });

//       const moveBullet = () => {
//         bulletsRef.current = bulletsRef.current
//           .map((bullet) => {
//             if (bullet.id === bulletId) {
//               const newX = bullet.x + speedX;
//               const newY = bullet.y + speedY;
//               if (newX < -15 || newX > 345 || newY < -15 || newY > 399) {
//                 return null;
//               }
//               return { id: bullet.id, x: newX, y: newY };
//             }
//             return bullet;
//           })
//           .filter(Boolean);

//         bulletsRef.current.forEach((bullet) => {
//           if (
//             bullet.x < playerX + 30 &&
//             bullet.x + 15 > playerX &&
//             bullet.y < playerY + 30 &&
//             bullet.y + 15 > playerY
//           ) {
//             setIsGameOver(true);
//           }
//         });

//         if (!isGameOver) {
//           requestAnimationFrame(moveBullet);
//         }
//       };
//       moveBullet();
//     };

//     const interval = setInterval(spawnBullet, spawnInterval);
//     return () => clearInterval(interval);
//   }, [spawnInterval, isGameOver]);

//   useEffect(() => {
//     if (score % 5 === 0 && score > 0) {
//       setSpawnInterval((prev) => Math.max(300, prev - 100));
//     }
//   }, [score]);

//   return (
//     <Html
//       style={{
//         width: "330px",
//         height: "384px",
//         borderRadius: "3px",
//         padding: "0",
//         overflowX: "hidden",
//       }}
//       position={[0, 4, -4]}
//       rotation-x={Math.PI / -2}
//       occlude
//       className="scrollbar-hide"
//       scale={5}
//       transform
//     >
//       <div className="relative w-[330px] h-[384px] border border-black" ref={gameRef}>
//         {bulletsRef.current.map((bullet) => (
//           <div
//             key={bullet.id}
//             className="absolute w-[15px] h-[15px] bg-red-500"
//             style={{ left: `${bullet.x}px`, top: `${bullet.y}px` }}
//           />
//         ))}
//         <div
//           className={clsx("absolute w-[30px] h-[30px] bg-blue-500", { hidden: isGameOver })}
//           style={{ left: `${playerX}px`, top: `${playerY}px` }}
//         />
//         {isGameOver && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl">
//             Game Over
//           </div>
//         )}
//       </div>
//       <div className="text-center mt-2 text-lg">Score: {score}</div>
//       <div className="flex justify-center gap-2 mt-2">
//         <button className="btn" onClick={() => movePlayer(-10, 0)}>
//           ⬅
//         </button>
//         <button className="btn" onClick={() => movePlayer(10, 0)}>
//           ➡
//         </button>
//         <button className="btn" onClick={() => movePlayer(0, -10)}>
//           ⬆
//         </button>
//         <button className="btn" onClick={() => movePlayer(0, 10)}>
//           ⬇
//         </button>
//       </div>
//     </Html>
//   );
// };

// export default Game;
