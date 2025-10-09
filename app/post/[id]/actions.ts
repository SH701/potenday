"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

// 🔹 현재 로그인한 Clerk 사용자 ID 가져오기
async function getCurrentUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("로그인이 필요합니다.");
  return userId;
}

// 🔹 게시물 상세 가져오기
export async function getPostDetail(postId: number) {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          username: true,
          nickname: true, // ✅ 추가
          email: true, // ✅ 추가
          photo: true,
        },
      },
      comments: {
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: {
              username: true,
              nickname: true,
              email: true,
              photo: true,
            },
          },
        },
      },
      Like: {
        select: { userId: true },
      },
    },
  });

  if (!post) notFound();
  return { ...post, likeCount: post.Like.length };
}

// 🔹 댓글 작성
export async function addComment(formData: FormData) {
  const userId = await getCurrentUserId(); // ✅ await 추가!

  const rawPostId = formData.get("postId");
  const commentText = formData.get("comment")?.toString().trim();

  if (!rawPostId || isNaN(Number(rawPostId))) {
    throw new Error("유효하지 않은 postId 입니다.");
  }

  if (!commentText) {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  const postId = Number(rawPostId);

  await db.comment.create({
    data: {
      comment: commentText,
      postId,
      userId, // ✅ 이제 string 타입
    },
  });

  revalidatePath(`/post/${postId}`);
}

// 🔹 댓글 목록 가져오기
export async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId },
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: { username: true, photo: true },
      },
    },
  });

  return comments;
}

// 🔹 좋아요 추가
export async function likePost(postId: number) {
  const userId = await getCurrentUserId(); // ✅ await 추가!

  const existing = await db.like.findFirst({
    where: { postId, userId },
    select: { id: true },
  });

  if (!existing) {
    await db.like.create({
      data: { postId, userId },
    });
  }

  revalidatePath(`/post/${postId}`);
}

// 🔹 좋아요 취소
export async function dislikePost(postId: number) {
  const userId = await getCurrentUserId(); // ✅ await 추가!

  const existing = await db.like.findFirst({
    where: { postId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("좋아요하지 않은 게시물입니다.");
  }

  await db.like.delete({
    where: { id: existing.id },
  });

  revalidatePath(`/post/${postId}`);
}
