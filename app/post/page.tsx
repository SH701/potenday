import { getAllPosts } from "./actions";
import Link from "next/link";
import Image from "next/image";
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
  const { posts, totalPage } = await getAllPosts(pages);
  const user = await currentUser();

  return (
    <>
      <div className="relative flex items-start justify-center min-h-screen overflow-hidden transition-colors duration-500 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-28">
        <Header />
        <div className=" flex flex-col w-[80%] h-full mx-auto">
          <AddPost />
          {/* 게시글 목록 */}
          {posts.length === 0 ? (
            <span className="mt-[10%] text-center text-gray-600">
              등록된 글이 없습니다.
            </span>
          ) : (
            <div className="mt-10 py-4 px-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
              {posts.map((post: any) => (
                <Link
                  href={`/post/${post.id}`}
                  key={post.id}
                  className="block border-t first:border-t-0 border-gray-200/50 pb-4 pt-5 hover:bg-purple-50/40 rounded-xl transition-all duration-200"
                >
                  <div className="flex gap-4">
                    {/* 프로필 */}
                    {post.user.photo ? (
                      <Image
                        src={post.user.photo}
                        alt="avatar"
                        width={44}
                        height={44}
                        className="rounded-full size-11 border border-gray-200"
                      />
                    ) : (
                      <Image
                        src={user?.imageUrl || "/default-avatar.png"}
                        alt="프로필"
                        width={44}
                        height={44}
                        className="size-11 rounded-full border border-gray-200"
                      />
                    )}

                    {/* 내용 */}
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-gray-800">
                          {post.user.username ??
                            post.user.nickname ??
                            post.user.email ??
                            "익명 사용자"}
                        </p>
                        <PostDate date={post.created_at} />
                      </div>
                      <p className="pt-2 text-sm text-gray-700 leading-relaxed">
                        {post.post}
                      </p>
                      {post.photo && (
                        <div className="mt-3">
                          <Image
                            src={post.photo}
                            alt="post image"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover max-h-80 w-full shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="flex gap-2 mt-8 justify-center">
            {Array.from({ length: totalPage }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={`/post?page=${pageNum}`}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    pages === pageNum
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white/60 text-gray-700 border-gray-200 hover:bg-purple-50"
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
