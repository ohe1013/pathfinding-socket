import { create } from "zustand";

type InfoObj = {
  situation: "discovery" | "photo";
};

type InfoStore = {
  state: InfoObj;
  setState: (newState: InfoObj) => void;
};

const useInfo = create<InfoStore>((set) => ({
  state: {
    situation: "discovery",
  },
  setState: (newState) => set({ state: newState }),
}));

export default useInfo;
