import useInfo from "@/store/info";
import { MusicButton } from "./MusicButton";
import useModalStore from "@/store/modal";
import { toast } from "react-toastify";

interface LobbyUIProps {
  useName: boolean;
  fixName: () => void;
  unFixName: () => void;
  name: string;
  setName: (name: string) => void;
}

export const LobbyUI = (props: LobbyUIProps) => {
  const { fixName, useName, unFixName, name, setName } = props;
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const handleConfirm = () => {
    setInfo({ ...info, situation: "room" });
    fixName();
  };
  const openModal = useModalStore((state) => state.openModal);
  const openConfirmModal = () => {
    if (name === "") {
      toast.warn("이름을 입력해주세요.");
      return;
    }
    openModal(`${name}으로 입장하시겠습니까?`, handleConfirm);
  };
  const switchSituation = () => {
    if (useName === false) {
      openConfirmModal();
    } else {
      setInfo({ ...info, situation: "room" });
    }
  };
  return (
    <>
      <div className="pointer-events-auto p-4 flex items-center space-x-4">
        <input
          type="text"
          className="w-56 border px-5 p-4 h-full rounded-full"
          placeholder="이름"
          disabled={useName}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {useName && (
          <button
            className="p-4 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors"
            onClick={unFixName}
          >
            🛠️
          </button>
        )}
        {!useName && (
          <button
            className="p-4 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors"
            onClick={fixName}
          >
            🔑
          </button>
        )}
      </div>
      <div className="flex items-center space-x-4 pointer-events-auto">
        <button
          className="p-4 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors"
          onClick={switchSituation}
        >
          놀러가기
        </button>
        <MusicButton />
      </div>
    </>
  );
};
