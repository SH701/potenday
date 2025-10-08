import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 타입 정의
interface NaverPlace {
  title: string;
  address: string;
  category: string;
}

interface PlaceInfo {
  name: string;
  address: string;
  category: string;
}

interface Recommendation {
  icon: string;
  title: string;
  desc: string;
  time: string;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
}

async function searchRealPlaces(
  gu: string,
  category: string
): Promise<PlaceInfo[]> {
  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        gu + " " + category
      )}&display=5`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.items || []).map((item: NaverPlace) => ({
      name: item.title.replace(/<[^>]*>/g, ""),
      address: item.address,
      category: item.category,
    }));
  } catch (error) {
    console.error(`Failed to search places for ${gu} ${category}:`, error);
    return [];
  }
}

export async function generateGuRecommendations(
  name: string,
  vibe: string,
  hotspot: string
): Promise<Recommendation[]> {
  try {
    const [cafes, restaurants, attractions] = await Promise.all([
      searchRealPlaces(name, "카페"),
      searchRealPlaces(name, "맛집"),
      searchRealPlaces(name, "명소"),
    ]);

    if (
      cafes.length === 0 &&
      restaurants.length === 0 &&
      attractions.length === 0
    ) {
      console.warn(`No places found for ${name}`);
      return [];
    }

    const prompt = `
너는 서울 ${name} 여행 큐레이터야.

아래는 **실제 검색된 장소들**이야:

카페: ${cafes.map((c) => c.name).join(", ") || "없음"}
맛집/식당: ${restaurants.map((r) => r.name).join(", ") || "없음"}
명소/관광지: ${attractions.map((a) => a.name).join(", ") || "없음"}

이 중에서 ${vibe} 분위기에 맞고 ${hotspot} 근처의 장소를 3곳 골라서 추천해줘.

규칙:
1. **반드시 위 목록에서만 선택**할 것
2. ${vibe} 분위기와 ${hotspot} 테마에 가장 잘 맞는 3곳 선택
3. 각 카테고리에서 최소 1곳씩 선택 (가능한 경우)
4. 카페/맛집은 유명하고 평점 높은 곳 우선
5. 위 목록에 적합한 장소가 없으면 다른 카테고리로 대체

icon은 다음 중 선택: "Coffee", "Utensils", "Camera", "ShoppingBag", "Map"

JSON 형식으로 반환:
{
  "recommendations": [
    {
      "icon": "Coffee",
      "title": "정확한 장소명",
      "desc": "15자 이내 특징",
      "time": "운영시간 (모르면 10:00-22:00)"
    },
    {
      "icon": "Utensils",
      "title": "정확한 장소명",
      "desc": "15자 이내 특징",
      "time": "운영시간"
    },
    {
      "icon": "Camera",
      "title": "정확한 장소명",
      "desc": "15자 이내 특징",
      "time": "운영시간"
    }
  ]
}
`;

    const res = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = res.choices[0].message.content || "{}";
    const parsed: RecommendationResponse = JSON.parse(content);

    return parsed.recommendations || [];
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    return [];
  }
}
