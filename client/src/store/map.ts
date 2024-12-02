import { create } from "zustand";

type Item = Record<string, { size: [number, number]; name: string }>;

interface MapObj {
  size: [number, number];
  gridDivision: number;
  items: Item[];
}

interface MapStore {
  state: MapObj | undefined;
  setState: (state: MapObj) => void;
}

const useMapStore = create<MapStore>((set) => ({
  state: undefined,
  setState: (newState: MapObj) => set({ state: newState }),
}));

export default useMapStore;
