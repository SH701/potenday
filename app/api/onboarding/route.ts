import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "아이디가 존재하지 않습니다." },
      { status: 401 }
    );
  }

  const { interests } = await req.json();
  const clerkUser = await currentUser(); // Clerk 유저 정보 가져오기

  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {
      interests,
      nickname: clerkUser?.fullName || clerkUser?.firstName || null,
      photo: clerkUser?.imageUrl,
      email: clerkUser?.primaryEmailAddress?.emailAddress || null,
    },
    create: {
      clerkId: userId,
      interests,
      nickname: clerkUser?.fullName || clerkUser?.firstName || null,
      photo: clerkUser?.imageUrl,
      email: clerkUser?.primaryEmailAddress?.emailAddress || null,
    },
  });

  return NextResponse.json(user);
}
