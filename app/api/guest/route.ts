import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

const MAX_GUEST = 3;

export async function GET() {
  try {
    const { userId } = await auth();
    if (userId) return NextResponse.json({ guestRemaining: null });

    const raw = cookies().get("guest_created_count")?.value;
    const count = raw ? parseInt(raw, 10) : 0;
    return NextResponse.json({
      guestRemaining: Math.max(0, MAX_GUEST - count),
    });
  } catch (e) {
    console.error("guest-remaining error", e);
    return NextResponse.json(
      { guestRemaining: 0, error: "server_error" },
      { status: 500 }
    );
  }
}
