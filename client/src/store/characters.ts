import { create } from "zustand";

type CharactersObj = {
  id: string;
  position: [number, number, number];
};

interface CharactersStore {
  state: CharactersObj[] | undefined;
  setState: (state: CharactersObj[]) => void;
}

const useCharactersStore = create<CharactersStore>((set) => ({
  state: undefined,
  setState: (newState) => set({ state: newState }),
}));

export default useCharactersStore;
