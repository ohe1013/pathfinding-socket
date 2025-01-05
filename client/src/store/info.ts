import { create } from "zustand";

type InfoObj = {
  situation: "lobby" | "room";
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
