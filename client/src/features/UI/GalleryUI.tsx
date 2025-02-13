import { addVote } from "@/hooks/useVote";
import useGalleryStore from "@/store/galleryImage";
import useInfo from "@/store/info";
import { MusicButton } from "./MusicButton";

interface GalleryUIProps {
  openModal: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  name: string;
}

export const GalleryUI = (props: GalleryUIProps) => {
  const { openModal, name } = props;
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const { clickedIdx, isClicked, setClickedIdx } = useGalleryStore();
  const switchSituation = () => {
    setInfo({ ...info, situation: "room" });
  };
  const vote = () => {
    openModal("투표하시겠어요?", () => {
      setClickedIdx(false, null);
      setInfo({ ...info, situation: "room" });
      addVote({ idx: clickedIdx!, name });
    });
  };

  return (
    <>
      <div className="pointer-events-auto p-4 text-white flex items-center space-x-4">
        <div className="w-80 border px-5 p-4 h-full rounded-full">
          <p>Best사진에 투표해주세요. [🗳️ 클릭] </p>
          <p>액자사진 뽑는데 반영할게요☺️</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 pointer-events-auto">
        <>
          <button
            className="p-4 rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors"
            onClick={switchSituation}
          >
            돌아가기
          </button>
          <button
            className={`p-4 text-xl rounded-full bg-pink-500 text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors 
                        ${!isClicked ? "bg-pink-500 opacity-50" : "bg-pink-500"}
                        `}
            onClick={vote}
          >
            🗳️
          </button>
        </>
        <MusicButton />
      </div>
    </>
  );
};
