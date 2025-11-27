"use client";

import { deletePost } from "@/app/post/actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Props {
  postId: number;
  authorId: string; // 작성자 Clerk ID
}

export default function DeletePost({ postId, authorId }: Props) {
  const router = useRouter();
  const { user } = useUser();

  if (!user || user.id !== authorId) return null;

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await deletePost(postId);
    if (res.success) {
      alert("삭제되었습니다.");
      router.push("/post");
    } else {
      alert(res.error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="ml-auto text-sm text-red-500 hover:text-red-700 font-semibold transition"
    >
      삭제
    </button>
  );
}
