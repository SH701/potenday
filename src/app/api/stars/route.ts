import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    let { placeId, title, desc, icon, time, price, address } = requestBody;

    if (!address && title) {
      try {
        const detailUrl = `${baseUrl}/api/place-detail?query=${encodeURIComponent(
          title
        )}&count=1`;

        const detailResponse = await fetch(detailUrl, {});

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          const fetchedDetail = detailData.detail;

          if (fetchedDetail) {
            address = fetchedDetail.roadAddress || fetchedDetail.address;
          }
        } else {
          console.error(
            "❌ Failed to fetch place details from API:",
            detailResponse.status
          );
        }
      } catch (fetchError) {
        console.error("🔥 Error during detail fetch:", fetchError);
      }
    }

    const star = await db.star.create({
      data: {
        userId,
        placeId,
        title,
        desc,
        icon,
        time,
        price,
        address,
      },
    });

    revalidatePath("/me");
    return NextResponse.json({ saved: true, star });
  } catch (error) {
    console.error("Error creating star:", error);
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

    await db.star.deleteMany({
      where: {
        userId,
        placeId,
      },
    });

    return NextResponse.json({ saved: false });
  } catch (error) {
    console.error("Error deleting star:", error);
    return NextResponse.json(
      {
        error: "Failed to delete",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
