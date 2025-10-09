import { NextResponse } from "next/server";
import { guData } from "@/lib/gudata";
import { searchNaverPlaces } from "@/lib/naver";

interface NaverPlace {
  title: string;
  address: string;
  category: string;
  roadAddress?: string;
  link?: string;
}

interface EnrichedPlace extends NaverPlace {
  keyword: string;
  icon: string;
}

function getIcon(category: "cafe" | "restaurant" | "attraction") {
  const map = { cafe: "Coffee", restaurant: "Utensils", attraction: "Camera" };
  return map[category];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gu = guData.find((g) => g.id === params.id);
    if (!gu)
      return NextResponse.json({ error: "Gu not found" }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category") as
      | "cafe"
      | "restaurant"
      | "attraction";

    const categoryKeywords = {
      cafe: ["카페", "베이커리", "디저트"],
      restaurant: ["맛집", "레스토랑", "식당"],
      attraction: ["명소", "관광지", "공원"],
    };

    const selectedCategory =
      categoryParam && categoryKeywords[categoryParam]
        ? categoryParam
        : "restaurant";

    const keywords = categoryKeywords[selectedCategory];

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        const places = await searchNaverPlaces(`${gu.name} ${keyword}`);
        return places.map(
          (p: NaverPlace): EnrichedPlace => ({
            ...p,
            keyword,
            icon: getIcon(selectedCategory),
          })
        );
      })
    );

    const all = results.flat();

    const unique = Array.from(
      new Map(
        all.map((p) => [p.title.replace(/<[^>]*>/g, "").trim(), p])
      ).values()
    ).slice(0, 4);

    return NextResponse.json({ recommendations: unique });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
