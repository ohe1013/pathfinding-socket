import { Coordinate, Size } from "@/types";
import { create } from "zustand";

export type RoomId = "lobby" | "cosyroom" | "partyroom" | "bathroom" | "weddingroom";

export type RoomObj = {
  id: RoomId;
  name: string;
  password: string;
  items: Item[];
};
export type Item = {
  name: string;
  size: Size;
  rotation: number;
  gridPosition: Coordinate;
  wall?: boolean;
  walkable?: boolean;
  positionY?: number;
  touchEvt?:
    | {
        type: "switchRoom";
        position: string;
        roomId: RoomId;
      }
    | {
        type: "watchPhoto";
      };
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
