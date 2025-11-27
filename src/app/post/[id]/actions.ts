"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getCurrentUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("로그인이 필요합니다.");
  return userId;
}

export async function getPostDetail(postId: number) {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          username: true,
          nickname: true,
          email: true,
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

export async function addComment(formData: FormData) {
  const userId = await getCurrentUserId();

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
      userId,
    },
  });

  revalidatePath(`/post/${postId}`);
}

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

export async function likePost(postId: number) {
  const userId = await getCurrentUserId();

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

export async function dislikePost(postId: number) {
  const userId = await getCurrentUserId();

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
