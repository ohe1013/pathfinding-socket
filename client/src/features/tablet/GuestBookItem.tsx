interface GuestBookPostForm {
  id?: string;
  name: string;
  password: string;
  content: string;
  timestamp: number;
}
export default function GuestBookItem(props: { posts: GuestBookPostForm[] }) {
  return (
    <div className="w-full overflow-y-auto flex flex-col space-y-2">
      {props.posts.map((post) => (
        <div
          key={post.id}
          className="m-4 p-2 rounded-lg bg-transparent bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer pointer-events-auto"
        >
          <p className="text-uppercase font-bold text-lg">{post.name}</p>
          <pre className="flex items-center gap-2 break-words whitespace-pre-wrap">
            {post.content}
          </pre>
        </div>
      ))}
    </div>
  );
}
