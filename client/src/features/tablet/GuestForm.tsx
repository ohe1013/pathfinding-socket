import React, { useState } from "react";
import nonPrivateImage from "@/assets/images/non-private-icon.png";
import privateImage from "@/assets/images/private-icon.png";
import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import useForm from "@/hooks/useForm";
import { GuestBookPostForm } from "@/types";
import { useAddPost, useRemovePost, useUpdatePost } from "@/hooks/useGuestBook";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormValid: (data: GuestBookPostForm) => Partial<GuestBookPostForm>;
  type: "insert" | "update" | "delete";
  initialValues?: GuestBookPostForm;
}

export const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  onFormValid,
  type = "insert",
  initialValues = {
    password: "",
    name: "",
    content: "",
    timestamp: 0,
  },
}) => {
  const addPostMutation = useAddPost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useRemovePost();
  const mutation =
    type === "insert"
      ? addPostMutation
      : type === "delete"
      ? deletePostMutation
      : updatePostMutation;

  const [showPassword, setShowPassword] = useState(true);
  const { handleChange, handleSubmit, values, errors, clear } = useForm<GuestBookPostForm>({
    initialValues,
    onSubmit: (values: GuestBookPostForm) => {
      mutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
    validate: onFormValid,
  });

  const typeText = type === "insert" ? "작성" : type === "delete" ? "삭제" : "수정";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Heading>방명록 글 {typeText}</Heading>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            value={values.name}
            type="text"
            name="name"
            placeholder="이름"
            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
            disabled={type === "delete"}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <div className="relative">
            <input
              onChange={handleChange}
              value={values.password}
              type={showPassword ? "password" : "text"}
              name="password"
              placeholder="비밀번호"
              className="border border-gray-300 rounded-lg p-2 text-sm w-full pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
            >
              <img
                src={showPassword ? privateImage : nonPrivateImage}
                alt="Toggle password visibility"
                className="w-6 h-6 opacity-70"
              />
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <textarea
            onChange={handleChange}
            value={values.content}
            placeholder="내용"
            name="content"
            rows={4}
            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
            disabled={type === "delete"}
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

          <div className="flex justify-end gap-2">
            <Button type="submit">{typeText}</Button>
            <Button
              onClick={() => {
                clear();
                onClose();
              }}
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
