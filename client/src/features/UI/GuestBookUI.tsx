import useInfo from "@/store/info";
import { Music } from "../svg/MusicSvg";

interface GuestBookUIProps {
  switchMusic: () => void;
}

export const GuestBookUI = (props: GuestBookUIProps) => {
  const { switchMusic } = props;
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const switchSituation = () => {
    setInfo({ ...info, situation: "room" });
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
        </>
        <button
          className={`p-4 rounded-full text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors ${
            !info.useMusic ? "bg-pink-500 opacity-50" : "bg-pink-500"
          }`}
          onClick={switchMusic}
        >
          <Music />
        </button>
      </div>
    </>
  );
};
