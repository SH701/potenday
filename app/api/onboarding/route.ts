import { auth } from "@clerk/nextjs/server";
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
  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: { interests },
    create: { clerkId: userId, interests },
  });
  return NextResponse.json(user);
}
