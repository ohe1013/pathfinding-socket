import { realtimeDb } from "@/firebase/firebase";
import { push, ref, set } from "firebase/database";
import { toast } from "react-toastify";

interface Vote {
  idx: number;
  name: string;
}

export const addVote = async (vote: Vote) => {
  const postRef = ref(realtimeDb, "vote");
  const newPostRef = push(postRef);

  await set(newPostRef, {
    ...vote,
    timestamp: Date.now(),
  });
  toast.success("투표했어요.😁");
};
interface Score {
  score: number;
  name: string;
}

export const addRank = async (vote: Score) => {
  const postRef = ref(realtimeDb, "rank");
  const newPostRef = push(postRef);

  await set(newPostRef, {
    ...vote,
    timestamp: Date.now(),
  });
};
