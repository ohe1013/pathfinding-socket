import { Coordinate } from "@/types";
import { create } from "zustand";

export type RoomObj = {
  id: "lobby" | "cosyroom" | "partyroom" | "bathroom";
  name: string;
  password: string;
  items: Item[];
};
type Item = {
  name: string;
  size: Coordinate;
  rotation: number;
  gridPosition: Coordinate;
  wall?: boolean;
  walkable?: boolean;
};

interface RoomsStore {
  state: RoomObj[] | undefined;
  setState: (state: RoomObj[]) => void;
}

const useRoomsStore = create<RoomsStore>((set) => ({
  state: undefined,
  setState: (newState) => set({ state: newState }),
}));

export default useRoomsStore;
