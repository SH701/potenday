import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";


export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ saved: false });
    }

    const { placeId } = await request.json();

    const star = await db.star.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
    });

    return NextResponse.json({ saved: !!star });
  } catch (error) {
    return NextResponse.json({ saved: false });
  }
}
