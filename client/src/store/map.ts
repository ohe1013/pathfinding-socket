import { create } from "zustand";
import { Item, RoomId } from "./rooms";

export interface MapObj {
  roomId: RoomId;
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
