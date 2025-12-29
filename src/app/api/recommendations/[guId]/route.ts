import { guData } from "@/data/gudata";
import { generateGuRecommendations } from "@/lib/openai";
import { NextResponse } from "next/server";

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
