interface GuestBookPostForm {
  id?: string;
  name: string;
  password: string;
  content: string;
  timestamp: number;
}
export default function Guestbook(props: { posts: GuestBookPostForm[] }) {
  return (
    <div className="w-full overflow-y-auto flex flex-col space-y-2">
      {props.posts.map((post) => (
        <div
          key={post.id}
          className="p-4 rounded-lg bg-transparent bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer pointer-events-auto"
        >
          <p className="text-uppercase font-bold text-lg">{post.name}</p>
          <div className="flex items-center gap-2">{post.content}</div>
        </div>
      ))}
    </div>
  );
}
