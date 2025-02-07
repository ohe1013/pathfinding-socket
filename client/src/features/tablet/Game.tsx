import { Html } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import "./game.css";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { realtimeDb } from "@/firebase/firebase";
import { addRank } from "@/hooks/useVote";

const scale = 10;
const rows = 20;
const columns = 20;

const Game = ({ onClose }: { onClose: () => void }) => {
  const scoreRef = useRef(0);
  const snakeRef = useRef([{ x: 0, y: 0 }]);
  const directionRef = useRef({ x: scale, y: 0 }); // 최신 방향 저장
  const fruitRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const gameIntervalRef = useRef<NodeJS.Timeout>();
  const highScoresRef = useRef<{ name: string; score: number }[]>([]);
  const speedRef = useRef(250); // 초기 속도 설정
  useEffect(() => {
    fruitRef.current = pickLocation();
    const canvas = canvasRef.current;
    if (canvas) ctxRef.current = canvas.getContext("2d")!;
  }, []);
  useEffect(() => {
    const guestBookRef = ref(realtimeDb, "rank");
    const q = query(guestBookRef, orderByChild("score"));

    onValue(q, (snapshot) => {
      const scores: { id: string; name: string; score: number }[] = [];

      snapshot.forEach((childSnapshot) => {
        scores.push({
          id: childSnapshot.key!,
          ...childSnapshot.val(),
        });
      });

      // 점수가 낮은 순으로 정렬되므로, 높은 점수가 먼저 나오도록 뒤집음
      highScoresRef.current = scores.reverse();
    });
  }, []);

  const drawGame = () => {
    if (!ctxRef.current) return;
    ctxRef.current.clearRect(0, 0, columns * scale, rows * scale);

    // 과일 그리기
    ctxRef.current.fillStyle = "#FF4136";
    ctxRef.current.fillRect(
      fruitRef.current.x,
      fruitRef.current.y,
      scale,
      scale
    );

    // 뱀 그리기
    ctxRef.current.fillStyle = "#4CAF50";
    snakeRef.current.forEach((segment) => {
      ctxRef.current!.fillRect(segment.x, segment.y, scale, scale);
    });
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        ctxRef.current = canvas.getContext("2d")!;
        fruitRef.current = pickLocation(); // 과일 위치 설정
        drawGame(); // 초기 상태 그리기
      }
    }, 0);
  }, []);
  const startGame = () => {
    resetGame(); // 게임 초기화 및 초기 상태 그리기
    if (!gameIntervalRef.current) {
      gameIntervalRef.current = setInterval(updateGame, speedRef.current);
    }
  };

  const stopGame = () => {
    clearInterval(gameIntervalRef.current);
    gameIntervalRef.current = undefined;
  };

  const updateGame = () => {
    const newSnake = [...snakeRef.current];
    const head = {
      x: newSnake[newSnake.length - 1].x + directionRef.current.x,
      y: newSnake[newSnake.length - 1].y + directionRef.current.y,
    };
    newSnake.push(head);

    if (head.x === fruitRef.current.x && head.y === fruitRef.current.y) {
      scoreRef.current += 1;
      fruitRef.current = pickLocation();
      speedRef.current = Math.max(speedRef.current - 20, 50); // 최소 속도 설정
      restartGameInterval(); // 속도 변경 후 인터벌 재시작
    } else {
      newSnake.shift();
    }

    if (checkCollision(head, newSnake)) {
      alert("Game Over! Score: " + scoreRef.current);
      addRank({ name: localStorage.getItem("name")!, score: scoreRef.current });
      resetGame();
    }

    snakeRef.current = newSnake;
    drawGame();
  };
  const restartGameInterval = () => {
    stopGame(); // 기존 인터벌 중지
    gameIntervalRef.current = setInterval(updateGame, speedRef.current); // 새로운 속도로 인터벌 설정
  };
  const checkCollision = (
    head: { x: number; y: number },
    snakeBody: Array<{ x: number; y: number }>
  ) => {
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= columns * scale ||
      head.y >= rows * scale ||
      snakeBody
        .slice(0, -1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    );
  };

  const reverse = () => {
    snakeRef.current = snakeRef.current.reverse();
    directionRef.current.x = directionRef.current.x * -1;
    directionRef.current.y = directionRef.current.y * -1;
  };

  const pickLocation = () => {
    return {
      x: Math.floor(Math.random() * columns) * scale,
      y: Math.floor(Math.random() * rows) * scale,
    };
  };

  const resetGame = () => {
    stopGame();
    snakeRef.current = [{ x: 0, y: 0 }];
    directionRef.current = { x: scale, y: 0 }; // 초기 방향 설정
    scoreRef.current = 0;
    fruitRef.current = pickLocation();
    speedRef.current = 250;
    drawGame();
  };

  const showHighScores = () => {
    if (!ctxRef.current) return;

    ctxRef.current.clearRect(0, 0, columns * scale, rows * scale);
    ctxRef.current.fillStyle = "#000";
    ctxRef.current.font = "16px Arial";
    ctxRef.current.fillText("High Scores:", 10, 20);

    highScoresRef.current.forEach((score, index) => {
      ctxRef.current!.fillText(
        `${index + 1 === 1 ? "🏆" : index + 1 + "등"} ${score.name}: ${
          score.score
        }`,
        10,
        40 + index * 20
      );
    });
  };

  const handleButton = (type: "up" | "down" | "left" | "right") => {
    switch (type) {
      case "up":
        directionRef.current = { x: 0, y: -scale };
        break;
      case "down":
        directionRef.current = { x: 0, y: scale };
        break;
      case "left":
        directionRef.current = { x: -scale, y: 0 };
        break;
      case "right":
        directionRef.current = { x: scale, y: 0 };
        break;
    }
  };

  return (
    <Html
      style={{
        width: "300px",
        height: "404px",
        borderRadius: "3px",
        padding: "0",
        overflowX: "hidden",
        marginLeft: "10px",
      }}
      position={[0, 4, -4]}
      rotation-x={Math.PI / -2}
      occlude
      className="scrollbar-hide"
      scale={5}
      transform
    >
      <div className="flex justify-between mx-4">
        <button onClick={onClose}>◀</button>
        <h1 className="text-center text-white text-2xl font-bold">🐍</h1>
        <button className="right-5 top-0" onClick={showHighScores}>
          🏆
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={columns * scale}
        height={rows * scale}
        className="m-auto border border-black"
      />
      <div className="controls">
        <div className="dpad">
          <div onClick={() => handleButton("up")} className="up"></div>
          <div onClick={() => handleButton("right")} className="right"></div>
          <div onClick={() => handleButton("down")} className="down"></div>
          <div onClick={() => handleButton("left")} className="left"></div>
          <div className="middle"></div>
        </div>
        <div className="a-b">
          <div className="b">B</div>
          <div onClick={reverse} className="a">
            A
          </div>
        </div>
      </div>
      <div className="start-select">
        <div className="select">SELECT</div>
        <div onClick={startGame} className="start">
          START
        </div>
      </div>
    </Html>
  );
};

export default Game;
