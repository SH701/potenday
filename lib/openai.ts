import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchRealPlaces(gu: string, category: string) {
  const response = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${gu} ${category}&display=5`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );
  const data = await response.json();
  return data.items.map((item: any) => ({
    name: item.title.replace(/<[^>]*>/g, ""),
    address: item.address,
    category: item.category,
  }));
}

export async function generateGuRecommendations(
  name: string,
  vibe: string,
  hotspot: string
) {
  const cafes = await searchRealPlaces(name, "카페");
  const restaurants = await searchRealPlaces(name, "맛집");
  const attractions = await searchRealPlaces(name, "명소");

  const prompt = `
너는 서울 ${name} 여행 큐레이터야.

아래는 **실제 검색된 장소들**이야:

카페: ${cafes.map((c: { name: any }) => c.name).join(", ")}
쇼핑, 마켓, 거리, 상점: ${restaurants
    .map((r: { name: any }) => r.name)
    .join(", ")}
전시, 공원, 명소, 전망, 산책: ${attractions
    .map((a: { name: any }) => a.name)
    .join(", ")}

이 중에서 ${vibe} 분위기에 맞고 ${hotspot} 근처의 장소를 3곳 골라서 추천해줘.
**반드시 위 목록에서만 선택**하고, 없으면 다른 카테고리로 대체해.
1. **반드시 위 목록에서만 선택**할 것
2. ${vibe} 분위기와 ${hotspot} 테마에 가장 잘 맞는 3곳 선택
3. 각 카테고리에서 최소 1곳씩 선택 (가능한 경우)
4. 카페/맛집은 유명하고 평점 높은 곳 우선
5. 위 목록에 적합한 장소가 없으면 명소로 대체

JSON 형식으로 반환:
{
  "recommendations": [
    {
      "icon": "Coffee",
      "title": "정확한 장소명",
      "desc": "15자 이내 특징",
      "time": "운영시간 (모르면 10:00 - 22:00)"
    },
    {
      "icon": "ShoppingBag",
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
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = res.choices[0].message.content || "{}";
  const parsed = JSON.parse(content);
  return parsed.recommendations || [];
}
