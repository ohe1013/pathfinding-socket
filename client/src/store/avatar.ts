import { socket } from "@/features/SocketManager";
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
      socket.emit("avatar", "");
    } else {
      set({ useUrl: true, url });
      socket.emit("avatar", url);
    }
  },
}));
