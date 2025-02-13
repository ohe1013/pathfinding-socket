import useInfo from "@/store/info";
import { Music } from "../svg/MusicSvg";

export const MusicButton = () => {
  const info = useInfo((info) => info.state);
  const setInfo = useInfo((info) => info.setState);
  const switchMusic = () => {
    if (info.useMusic) {
      setInfo({ ...info, useMusic: false });
    } else {
      setInfo({ ...info, useMusic: true });
    }
  };
  return (
    <button
      className={`p-4 rounded-full text-white drop-shadow-md cursor-pointer hover:bg-pink-800 transition-colors ${
        !info.useMusic ? "bg-pink-500 opacity-50" : "bg-pink-500"
      }`}
      onClick={switchMusic}
    >
      <Music />
    </button>
  );
};
