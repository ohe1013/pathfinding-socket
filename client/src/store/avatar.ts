import { create } from "zustand";

interface Avatar {
  useUrl: boolean;
  url: string;
  setUrl: (url: string) => void;
}

export const useAvatar = create<Avatar>((set) => ({
  useUrl: false,
  url: "",
  setUrl: (url: string) => {
    if (url === "") {
      set({ useUrl: false, url: "" });
    } else {
      set({ useUrl: true, url });
    }
  },
}));
