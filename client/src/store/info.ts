import { create } from "zustand";

export type Situation = "lobby" | "room" | "guestbook" | "gallery";

type InfoObj = {
  situation: Situation;
  useMusic: boolean;
};

type InfoStore = {
  state: InfoObj;
  setState: (newState: InfoObj) => void;
};

const useInfo = create<InfoStore>((set) => ({
  state: {
    situation: "lobby",
    useMusic: false,
  },
  setState: (newState) => set({ state: newState }),
}));

export default useInfo;
