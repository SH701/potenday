import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateGuRecommendations(
  name: string,
  vibe: string,
  hotspot: string
) {
  const prompt = `
${name} (${vibe} 분위기, 대표 핫스팟 ${hotspot})에서 즐길만한 장소 3곳을 추천해줘.

다음 JSON 형식으로 정확히 반환해줘:
{
  "recommendations": [
    {
      "icon": "Coffee",
      "title": "장소명",
      "desc": "장소 설명 (15자 이내)",
      "time": "운영시간 (예: 11:00 - 22:00)",
    }
  ]
}

아이콘은 반드시 Coffee, ShoppingBag, Camera 중 하나를 선택해줘.
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = res.choices[0].message.content || "{}";
  const parsed = JSON.parse(content);

  // recommendations 배열이 있으면 반환, 없으면 빈 배열
  return parsed.recommendations || [];
}
