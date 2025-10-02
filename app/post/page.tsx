import { getAllPosts } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { formatTimeAgo } from "@/lib/constant";
import PostDate from "@/components/post/PostDate";
import AddPost from "@/components/post/AddPost";
import { currentUser } from "@clerk/nextjs/server";
import Header from "@/components/Header";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export default async function Posts({ searchParams }: Props) {
  const { page } = await searchParams;
  const pages = Number(page || "1");
  const { posts, totalpage } = await getAllPosts(pages);
  const user = await currentUser();

  return (
    <>
      <div className="bg-green-50 pt-20">
        <Header />
        <div className="pb-10 flex flex-col">
          <div className="flex flex-col gap-5  p-7">
            <AddPost />
          </div>
          {posts.length === 0 ? (
            <span className="mt-[10%] text-center">등록된 글이 없습니다.</span>
          ) : (
            <div className="mt-4 py-2 px-4 bg-green-100 rounded-lg shadow-lg">
              {posts.map((post: any) => (
                <Link
                  href={`/post/${post.id}`}
                  key={post.id}
                  className="block border-t-2 first:border-t-0 border-gray-200 pb-3 pt-4"
                >
                  <div className="flex gap-3">
                    {post.user.photo ? (
                      <Image
                        src={post.user.photo}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full size-10"
                      />
                    ) : (
                      <Image
                        src={user?.imageUrl || "/default-avatar.png"}
                        alt="프로필"
                        width={40}
                        height={40}
                        className="size-10 rounded-full"
                      />
                    )}
                    <div className="flex flex-col flex-1">
                      <div className="flex gap-2">
                        <p className="text-sm font-semibold">
                          {post.user.username}
                        </p>
                        <PostDate date={formatTimeAgo(post.created_at)} />
                      </div>
                      <p className="pt-2 text-sm">{post.post}</p>
                      {post.photo && (
                        <div className="mt-3">
                          <Image
                            src={post.photo}
                            alt="post image"
                            width={600}
                            height={400}
                            className="rounded-md object-contain max-h-96 w-auto mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-6 justify-center">
            {Array.from({ length: totalpage }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={`/post?page=${pageNum}`}
                  className={`px-3 py-1 border rounded ${
                    pages === pageNum
                      ? "bg-green-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
