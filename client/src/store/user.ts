import { create } from "zustand";

type UserObj = string;

interface UserStore {
  state: UserObj | undefined;
  setState: (state: UserObj) => void;
}

const useUserStore = create<UserStore>((set) => ({
  state: undefined,
  setState: (newState) => set({ state: newState }),
}));

export default useUserStore;
