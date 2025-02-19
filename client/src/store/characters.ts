import { create } from "zustand";

export type CharactersObj = {
  id: string;
  position: [number, number, number];
  path: [number, number, number][];
  session: string;
  avatarUrl?: string;
};

interface CharactersStore {
  state: CharactersObj[] | undefined;
  setState: (state: CharactersObj[]) => void;
  setStateWithFilter: (state: CharactersObj) => void;
}

const useCharactersStore = create<CharactersStore>((set) => ({
  state: undefined,
  setState: (newState: CharactersObj[]) => {
    set({ state: newState });
  },
  setStateWithFilter: (newState: CharactersObj) => {
    set((state) => {
      return {
        state: state.state!.map((char) => (char.id === newState.id ? newState : char)),
      };
    });
  },
}));

export default useCharactersStore;
