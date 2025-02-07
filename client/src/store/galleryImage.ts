import { create } from "zustand";

interface GalleryState {
  isClicked: boolean;
  clickedIdx: number | null;
  setClickedIdx: (isClicked: boolean, clickedIdx: number | null) => void;
}

const useGalleryStore = create<GalleryState>((set) => ({
  isClicked: false,
  clickedIdx: null,
  setClickedIdx: (isClicked: boolean, clickedIdx: number | null) =>
    set({ isClicked, clickedIdx }),
}));

export default useGalleryStore;
