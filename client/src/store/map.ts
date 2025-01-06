import { create } from "zustand";
import { Item, RoomId } from "./rooms";
import { LoadState } from "@/types";

export interface MapObj {
  roomId: RoomId;
  size: [number, number];
  gridDivision: number;
  items: Item[];
}

interface MapStore {
  state: MapObj | undefined;
  setState: (state: MapObj) => void;
  loadState: LoadState;
  setLoadState: (loadState: LoadState) => void;
}

const useMapStore = create<MapStore>((set) => ({
  state: undefined,
  setState: (newState: MapObj) => {
    set({ state: newState });
  },
  loadState: "idle",
  setLoadState: (newLoadState: LoadState) => {
    set({ loadState: newLoadState });
  },
}));

export default useMapStore;
