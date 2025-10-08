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

interface RecommendationResponse {
  recommendations: EnrichedPlace[];
}

function getIconForKeyword(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase();

  if (
    lowerKeyword.includes("카페") ||
    lowerKeyword.includes("디저트") ||
    lowerKeyword.includes("베이커리")
  ) {
    return "Coffee";
  }

  if (
    lowerKeyword.includes("맛집") ||
    lowerKeyword.includes("레스토랑") ||
    lowerKeyword.includes("식당") ||
    lowerKeyword.includes("음식점")
  ) {
    return "Utensils";
  }

  if (
    lowerKeyword.includes("쇼핑") ||
    lowerKeyword.includes("마켓") ||
    lowerKeyword.includes("상점") ||
    lowerKeyword.includes("몰")
  ) {
    return "ShoppingBag";
  }

  if (
    lowerKeyword.includes("공원") ||
    lowerKeyword.includes("산책") ||
    lowerKeyword.includes("자연")
  ) {
    return "Map";
  }
  return "Camera";
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gu = guData.find((g) => g.id === params.id);
    if (!gu) {
      return NextResponse.json({ error: "Gu not found" }, { status: 404 });
    }

    const keywords = [
      "카페",
      "맛집",
      "명소",
      "베이커리",
      "레스토랑",
      "관광지",
      "디저트",
      "브런치",
      "공원",
    ];

    const searchPromises = keywords.map(async (keyword: string) => {
      try {
        const places = await searchNaverPlaces(`${gu.name} ${keyword}`);
        return places.map(
          (p: NaverPlace): EnrichedPlace => ({
            ...p,
            keyword,
            icon: getIconForKeyword(keyword),
          })
        );
      } catch (error) {
        return [];
      }
    });

    const settled = await Promise.allSettled(searchPromises);

    const allPlaces: EnrichedPlace[] = [];

    settled.forEach((result, index) => {
      if (result.status === "fulfilled") {
        allPlaces.push(...result.value);
      } else {
        console.error(
          `[Promise Rejected] Keyword ${keywords[index]}:`,
          result.reason
        );
      }
    });
    const seen = new Set<string>();
    const uniquePlaces = allPlaces.filter((place) => {
      const normalizedTitle = place.title.replace(/<[^>]*>/g, "").trim();

      if (seen.has(normalizedTitle)) {
        return false;
      }

      seen.add(normalizedTitle);
      return true;
    });

    const recommendations = balanceRecommendations(uniquePlaces, 9);

    return NextResponse.json({ recommendations } as RecommendationResponse);
  } catch (error) {
    console.error("[API Error] Failed to generate recommendations:", error);
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function balanceRecommendations(
  places: EnrichedPlace[],
  maxCount: number
): EnrichedPlace[] {
  if (places.length <= maxCount) {
    return places;
  }

  const grouped = new Map<string, EnrichedPlace[]>();

  places.forEach((place) => {
    const icon = place.icon;
    if (!grouped.has(icon)) {
      grouped.set(icon, []);
    }
    grouped.get(icon)!.push(place);
  });

  const result: EnrichedPlace[] = [];
  const iconTypes = Array.from(grouped.keys());

  if (iconTypes.length === 0) {
    return places.slice(0, maxCount);
  }

  const perCategory = Math.floor(maxCount / iconTypes.length);
  const remainder = maxCount % iconTypes.length;
  iconTypes.forEach((icon, index) => {
    const categoryPlaces = grouped.get(icon) || [];
    const limit = perCategory + (index < remainder ? 1 : 0);
    result.push(...categoryPlaces.slice(0, limit));
  });
  if (result.length < maxCount) {
    const used = new Set(result.map((p) => p.title));
    const remaining = places.filter((p) => !used.has(p.title));
    result.push(...remaining.slice(0, maxCount - result.length));
  }

  return result.slice(0, maxCount);
}
