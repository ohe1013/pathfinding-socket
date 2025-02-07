import { ref, push, get, set, remove, update } from "firebase/database";
import bcrypt from "bcryptjs";
import { realtimeDb } from "@/firebase/firebase";
import { GuestBookPostForm } from "@/types";
import { toast } from "react-toastify";

// 게시글 추가
export const addPost = async (newPost: GuestBookPostForm) => {
  const postRef = ref(realtimeDb, "guestbook");
  const newPostRef = push(postRef);
  const hashedPassword = await bcrypt.hash(newPost.password, 10);

  await set(newPostRef, {
    ...newPost,
    password: hashedPassword,
    timestamp: Date.now(),
  });
  toast.success("작성되었어요.😁");
};

// 게시글 수정
export const updatePost = async (post: GuestBookPostForm) => {
  const { id: postId, password } = post;
  const postRef = ref(realtimeDb, `guestbook/${postId}`);
  const snapshot = await get(postRef);

  if (snapshot.exists()) {
    const postData = snapshot.val() as GuestBookPostForm;
    const isMatch = await bcrypt.compare(password, postData.password);
    if (isMatch) {
      const newHashedPassword = password ? await bcrypt.hash(password, 10) : postData.password;
      await update(postRef, {
        ...post,
        password: newHashedPassword,
        timestamp: Date.now(),
      });
      toast.success("수정되었어요.😁");
    } else {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
  } else {
    throw new Error("게시글이 존재하지 않습니다.");
  }
};

// 게시글 삭제
export const deletePost = async (postId: string, inputPassword: string) => {
  const postRef = ref(realtimeDb, `guestbook/${postId}`);
  const snapshot = await get(postRef);

  if (snapshot.exists()) {
    const postData = snapshot.val() as GuestBookPostForm;
    console.log(postData);
    const isMatch = await bcrypt.compare(inputPassword, postData.password);

    if (isMatch) {
      await remove(postRef);
      toast.success("삭제되었어요.😁");
    } else {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
  } else {
    throw new Error("게시글이 존재하지 않습니다.");
  }
};
