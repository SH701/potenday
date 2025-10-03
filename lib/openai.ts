// lib/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateGuRecommendations(
  guName: string,
  vibe: string,
  hotspot: string
) {
  const prompt = `서울 ${guName}의 특징을 반영한 추천 장소 3곳을 JSON 형식으로 생성해주세요.

구의 특징:
- 분위기: ${vibe}
- 대표 핫플: ${hotspot}

다음 형식으로 응답해주세요:
[
  {
    "category": "cafe" | "restaurant" | "shopping" | "culture" | "activity",
    "title": "장소 이름",
    "desc": "한 줄 설명 (20자 이내)",
    "time": "운영 시간",
    "price": "₩" | "₩₩" | "₩₩₩" | "₩₩₩₩"
  }
]

실제로 존재하는 장소나 그 지역의 특징을 반영한 현실적인 추천을 해주세요.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "당신은 서울의 각 구를 잘 아는 로컬 가이드입니다. 각 구의 특색에 맞는 장소를 추천해주세요.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || "[]");
}
