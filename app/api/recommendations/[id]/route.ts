// app/api/recommendations/[guId]/route.ts
import { NextResponse } from "next/server";
import { guData } from "@/lib/gudata";
import { generateGuRecommendations } from "@/lib/openai";

export async function GET(
  request: Request,
  { params }: { params: { guId: string } }
) {
  try {
    const gu = guData.find((g) => g.id === params.guId);

    if (!gu) {
      return NextResponse.json({ error: "Gu not found" }, { status: 404 });
    }

    const recommendations = await generateGuRecommendations(
      gu.name,
      gu.vibe,
      gu.hotspot
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
