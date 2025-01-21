import { create } from "zustand";

export type Situation = "lobby" | "room" | "guestbook";

type InfoObj = {
  situation: Situation;
};

type InfoStore = {
  state: InfoObj;
  setState: (newState: InfoObj) => void;
};

const useInfo = create<InfoStore>((set) => ({
  state: {
    situation: "lobby",
  },
  setState: (newState) => set({ state: newState }),
}));

export default useInfo;
