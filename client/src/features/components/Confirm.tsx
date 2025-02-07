import useModalStore from "@/store/modal";
import { useEffect, useRef } from "react";

export const ConfirmModal = () => {
  const { isOpen, message, onConfirm, onCancel, closeModal } = useModalStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 w-10/12 rounded-lg shadow-lg max-w-md text-center"
      >
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onCancel();
              closeModal();
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm();
              closeModal();
            }}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
