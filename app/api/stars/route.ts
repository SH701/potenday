import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { placeId, title, desc, icon, time, price } = await request.json();

    const star = await db.star.create({
      data: {
        userId,
        placeId,
        title,
        desc,
        icon,
        time,
        price,
      },
    });

    return NextResponse.json({ saved: true, star });
  } catch (error) {
    console.error("Error creating star:", error); // ← 자세한 에러 로그
    return NextResponse.json(
      {
        error: "Failed to save",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { placeId } = await request.json();

    console.log("Deleting star:", { userId, placeId });

    await db.star.deleteMany({
      where: {
        userId,
        placeId,
      },
    });

    return NextResponse.json({ saved: false });
  } catch (error) {
    console.error("Error deleting star:", error); // ← 자세한 에러 로그
    return NextResponse.json(
      {
        error: "Failed to delete",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
