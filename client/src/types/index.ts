export type Coordinate = [number, number];

export type Size = [number, number];

export type LoadState = "idle" | "loading" | "success" | "error";

export interface GuestBookPostForm {
  id?: string;
  name: string;
  password: string;
  content: string;
  timestamp: number;
}
export type GuestBookPost = Omit<GuestBookPostForm, "password">;
