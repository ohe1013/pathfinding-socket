import useInfo from "@/store/info";
import useMapStore from "@/store/map";
import { useEffect, useRef } from "react";

export const Audio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const info = useInfo((state) => state.state);
  const map = useMapStore((state) => state.state);
  useEffect(() => {
    if (info.situation === "room" && map?.roomId === "weddingroom") {
      if (!audioRef.current?.paused) {
        audioRef.current?.pause();
      }
    } else {
      if (info.useMusic === true) {
        audioRef.current?.play();
        audioRef.current!.volume = 0.3;
      } else {
        audioRef.current?.pause();
      }
    }
  }, [info.situation, info.useMusic, map?.roomId]);

  return <audio ref={audioRef} src={"./musics/spring_snow.mp3"} loop={true} />;
};
