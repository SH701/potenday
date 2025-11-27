export const runtime = "nodejs";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const cu = await currentUser();

    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {
        email: cu?.primaryEmailAddress?.emailAddress,
        nickname: cu?.fullName || cu?.firstName,
        photo: cu?.imageUrl,
      },
      create: {
        clerkId: userId,
        email: cu?.primaryEmailAddress?.emailAddress,
        nickname: cu?.fullName || cu?.firstName,
        photo: cu?.imageUrl,
      },
    });
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
