import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  openModal: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  message: "",
  onConfirm: () => {},
  onCancel: () => {},

  openModal: (message, onConfirm, onCancel) =>
    set({
      isOpen: true,
      message,
      onConfirm,
      onCancel: onCancel ?? (() => {}), // onCancel이 없으면 기본값을 빈 함수로 설정
    }),

  closeModal: () => set({ isOpen: false }),
}));

export default useModalStore;
