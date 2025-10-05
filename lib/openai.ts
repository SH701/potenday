import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateGuRecommendations(
  name: string,
  vibe: string,
  hotspot: string
) {
  const prompt = `
너는 서울의 각 구에 대해 여행 큐레이터 역할을 하는 어시스턴트야.

사용자가 제시한 지역 정보 (예: ${name}, ${vibe}, ${hotspot})를 참고해서
해당 구 안에서 실제로 존재하는 명소, 카페, 전시 공간, 공원 등을 3곳 추천해줘.

조건:
- 반드시 **실존하는 장소명**을 사용해야 하며, 네이버 지도나 검색에서 찾을 수 있어야 해.
- 너무 일반적이거나 구체하지 않은 표현(예: "청담동 카페", "노원구 전망 좋은 곳")은 금지.
- 각 추천은 장소의 특징이 잘 드러나는 간결한 설명을 포함해야 해 (15자 이내).
- 운영시간은 실제 정보를 모를 경우, 일반적인 시간대(예: 10:00 - 22:00)로 가정해도 돼.
- 각 장소마다 아래 JSON 형식의 객체로 반환해.
- 아이콘은 장소 성격에 맞게 아래 중에서 고르기:
  - 카페, 브런치 → Coffee
  - 쇼핑, 마켓, 거리, 상점 → ShoppingBag
  - 전시, 공원, 명소, 전망, 산책 → Camera
-카페 드 파리는 빼버려 인기가 많아도
-네이버 지도에 나오는 위치를 기반으로 추천해줘야해
-네이버지도에 나오는 카페로 등록된것만 넣어줘
-실제로 없는걸 너가 지어내지마

반드시 다음 형식으로 정확히 반환:

{
  "recommendations": [
    {
      "icon": "Coffee",
      "title": "장소명",
      "desc": "장소 설명 (15자 이내)",
      "time": "운영시간 (예: 11:00 - 22:00)"
    },
    {
      "icon": "ShoppingBag",
      "title": "장소명",
      "desc": "장소 설명 (15자 이내)",
      "time": "운영시간"
    },
    {
      "icon": "Camera",
      "title": "장소명",
      "desc": "장소 설명 (15자 이내)",
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
