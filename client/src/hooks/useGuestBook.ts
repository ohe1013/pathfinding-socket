import { useMutation, useQuery } from "@tanstack/react-query";
import bcrypt from "bcryptjs";
import { get, push, ref, remove, set, update } from "firebase/database";
import { toast } from "react-toastify";
import { realtimeDb } from "@/firebase/firebase";
import { GuestBookPost, GuestBookPostForm } from "@/types";
// 게시글을 가져오는 함수
const fetchPosts = async (): Promise<GuestBookPost[]> => {
  const snapshot = await get(ref(realtimeDb, "guestbook"));
  if (snapshot.exists()) {
    return Object.entries(snapshot.val() as GuestBookPost[]).map((item) => item[1]);
  } else {
    return [];
  }
};

// 게시글을 추가하는 함수
const addPost = async (newPost: GuestBookPostForm): Promise<void> => {
  const postRef = ref(realtimeDb, `guestbook`); // 새로운 게시글의 ID를 사용하여 경로 설정
  const newPostRef = push(postRef);
  // 데이터 업데이트
  const hashedPassword = await bcrypt.hash(newPost.password, 10);
  await set(newPostRef, {
    ...newPost,
    password: hashedPassword,
    timestamp: Date.now(),
  });
};

const updatePost = async (post: GuestBookPostForm): Promise<void> => {
  const { id: postId, password } = post;
  const postRef = ref(realtimeDb, `guestbook/${postId}`); // 수정할 게시글 경로 지정

  // 기존 게시글 가져오기
  const snapshot = await get(postRef);

  if (snapshot.exists()) {
    const postData = snapshot.val() as GuestBookPostForm;
    const hashedPassword = postData.password; // 저장된 해시 비밀번호

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      // 비밀번호가 일치하면 수정
      const newHashedPassword = password
        ? await bcrypt.hash(password, 10) // 비밀번호가 변경되면 해싱 처리
        : hashedPassword; // 비밀번호 변경이 없으면 기존 비밀번호 유지

      await update(postRef, {
        ...post,
        password: newHashedPassword, // 비밀번호 저장
        timestamp: Date.now(), // 수정 시간 업데이트
      });
      console.log("게시글 수정 성공!");
    } else {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
  } else {
    throw new Error("게시글이 존재하지 않습니다.");
  }
};

async function deletePost(postId: string, inputPassword: string) {
  const postRef = ref(realtimeDb, `guestbook/${postId}`);
  const snapshot = await get(postRef);

  if (snapshot.exists()) {
    const postData = snapshot.val() as GuestBookPostForm;
    const hashedPassword = postData.password;

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
    // const isMatch = hashedPassword === inputPassword;
    // console.log(postData.password, inputPassword);
    if (isMatch) {
      await remove(postRef);
      console.log("게시글 삭제 성공!");
    } else {
      toast.error("비밀번호가 일치하지 않습니다!");
      throw new Error("e1");
    }
  } else {
    console.log("게시글이 존재하지 않습니다.");
  }
}
// 게시글을 가져오는 훅
const useFetchPosts = () => {
  return useQuery<GuestBookPost[]>({
    queryKey: ["guestbook"], // 캐싱 키
    queryFn: fetchPosts, // 패칭 함수
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱
  });
};

// 게시글을 추가하는 훅
const useAddPost = () => {
  return useMutation<void, Error, GuestBookPostForm>({
    mutationFn: addPost,

    onSuccess: () => {
      toast.success("방명록이 업데이트되었습니다!");
    },
    onError: (e) => {
      toast.error("에러가 발생했습니다!");
      console.error("error", e);
    },
  });
};

const useRemovePost = () => {
  return useMutation<void, Error, GuestBookPostForm>({
    mutationFn: (post) => deletePost(post.id!, post.password),
    onSuccess: () => {
      toast.info("방명록이 삭제되었습니다!");
    },
    onError: (e) => {
      if (e.message === "e1") {
        console.error("error", e);
      } else {
        toast.error("에러가 발생했습니다!");
      }
    },
  });
};
const useUpdatePost = () => {
  return useMutation<void, Error, GuestBookPostForm>({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.info("방명록이 수정되었습니다!");
    },
    onError: (e) => {
      if (e.message === "e1") {
        console.error("error", e);
      } else {
        toast.error("에러가 발생했습니다!");
      }
    },
  });
};

export { useFetchPosts, useAddPost, useRemovePost, useUpdatePost };
