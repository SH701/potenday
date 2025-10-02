"use server";

import db from "@/lib/db";
import z from "zod";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

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
          photo: true,
        },
      },
    },
  });
  const totalcount = await db.post.count();
  const totalpage = Math.ceil(totalcount / pageSize);

  return { totalpage, posts };
}
export async function writePost(prevState: unknown, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "유저 정보를 불러올 수 없습니다." };
  }

  const rawPost = formData.get("post");
  const result = postSchema.safeParse({ post: rawPost }); 

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  await db.post.create({
    data: {
      post: result.data.post.trim(),
      userId: user.id,
    },
  });

  revalidatePath("/post");
  return { success: true };
}
