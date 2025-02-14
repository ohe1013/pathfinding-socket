import { Html } from "@react-three/drei";
type Item = "" | "guestbook" | "game";
type ListProps = {
  onClose: () => void;
  onSelect: (id: Item) => void;
};

export const List = ({ onSelect, onClose }: ListProps) => {
  const menuList = [
    { id: "guestbook", name: "방명록" },
    { id: "game", name: "snake게임" },
  ] as const;
  const handleClick = (item: { id: Item; name: string }) => {
    onSelect(item.id);
  };
  return (
    <Html
      position={[0, 4, -4]} // ✅ 정확한 위치
      scale={5}
      rotation-x={Math.PI / -2} // ✅ 올바른 방향으로 회전
      style={{
        position: "absolute",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "330px",
          height: "384px",
          borderRadius: "3px",
          overflowY: "auto",
          transform: "translate(-50%, -53%)", // ✅ 중앙 정렬
          position: "relative", // ✅ 내부 요소 위치 보정
        }}
      >
        <div className="flex justify-between mx-4">
          <button onClick={onClose}>❌</button>
          <h1 className="text-center text-white text-2xl font-bold"></h1>
          <button onClick={() => {}} className="right-5 top-0"></button>
        </div>
        <div className="w-full overflow-y-auto flex flex-col">
          {menuList.map((menu) => (
            <div
              key={menu.id}
              className="mr-4 my-2 ml-3 p-4 rounded-lg bg-gray-800 bg-opacity-70 text-white hover:bg-gray-900 transition-colors cursor-pointer pointer-events-auto shadow-md"
            >
              <div onClick={() => handleClick(menu)} className="flex justify-between items-center">
                <p className="font-bold text-lg">{menu.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
};
