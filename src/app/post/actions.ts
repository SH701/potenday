"use server";

import { db } from "@/lib/db";
import z from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

const postSchema = z.object({
  post: z
    .string()
    .min(1, "내용을 입력해주세요")
    .max(280, "최대 280자까지 입력 가능합니다."),
});

const pageSize = 5;

export async function getAllPosts(page: number) {
  const posts = await db.post.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          clerkId: true,
          photo: true,
          nickname: true,
          username: true,
          email: true,
        },
      },
    },
  });

  const totalCount = await db.post.count();
  const totalPage = Math.ceil(totalCount / pageSize);

  return { totalPage, posts };
}

export async function writePost(prevState: unknown, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const rawPost = formData.get("post");
  const result = postSchema.safeParse({ post: rawPost });

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  await db.post.create({
    data: {
      post: result.data.post.trim(),
      userId,
    },
  });
  revalidatePath("/post");

  return { success: true };
}
export async function deletePost(postId: number) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { userId: true },
  });

  if (!post) {
    return { success: false, error: "존재하지 않는 게시물입니다." };
  }

  if (post.userId !== userId) {
    return { success: false, error: "게시물 작성자만 삭제할 수 있습니다." };
  }

  await db.post.delete({
    where: { id: postId },
  });

  revalidatePath("/post");
  return { success: true };
}
