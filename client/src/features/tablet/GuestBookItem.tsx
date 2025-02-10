import { CRUD } from "@/types";

interface GuestBookPostForm {
  id?: string;
  name: string;
  password: string;
  content: string;
  timestamp: number;
}

export default function GuestBookItem(props: {
  posts: GuestBookPostForm[];
  onEdit?: (type: CRUD, post: GuestBookPostForm) => void;
  onDelete?: (type: CRUD, post: GuestBookPostForm) => void;
}) {
  return (
    <div className="w-full overflow-y-auto flex flex-col">
      {props.posts.map((post) => (
        <div
          key={post.id}
          className="mr-4 my-2 ml-3 p-4 rounded-lg bg-gray-800 bg-opacity-70 text-white hover:bg-gray-900 transition-colors cursor-pointer pointer-events-auto shadow-md"
        >
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">{post.name}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => props.onEdit?.("update", post)}
                className="text-blue-400 hover:text-blue-600"
              >
                🔧
              </button>
              <button
                onClick={() => props.onEdit?.("delete", post)}
                className="text-red-400 hover:text-red-600"
              >
                🗑️
              </button>
            </div>
          </div>
          <pre className="mt-2 text-sm break-words whitespace-pre-wrap">{post.content}</pre>
          <p className="text-xs text-gray-400 text-right mt-2">
            {new Date(post.timestamp).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
