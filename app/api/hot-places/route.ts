import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchNaver(query: string) {
  const r = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
      query
    )}&display=5&sort=random`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );
  const data = await r.json();
  return data.items || [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gu = searchParams.get("gu");

  const keywordRes = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
        너는 서울 각 구별로 요즘 인기 있는 장소 키워드를 추천하는 어시스턴트야.
        네이버 지역검색에서 실제 결과가 나올 수 있는 간단하고 일반적인 키워드를 추천해.
        좋은 예시: ["카페", "맛집", "베이커리", "바", "브런치"]
        나쁜 예시: ["감성 카페", "루프탑 바", "플라워 카페"] (너무 구체적)
        반드시 JSON 형식으로 응답: {"keywords": ["키워드1", "키워드2", "키워드3"]}
        `,
      },
      {
        role: "user",
        content: `${gu}에서 요즘 인기 있는 장소 키워드 3개를 알려줘.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  let keywords: string[] = [];
  try {
    const parsed = JSON.parse(keywordRes.choices[0].message.content || "{}");
    keywords = parsed.keywords || [];
  } catch (err) {}

  const searchResults = await Promise.all(
    keywords.map(async (k) => {
      const results = await searchNaver(`서울 ${gu} ${k}`);
      return { keyword: k, results };
    })
  );

  const hotPlaces = searchResults
    .filter((e) => e.results.length > 0)
    .map((entry, idx) => ({
      rank: idx + 1,
      name: entry.keyword,
      tag: "실시간 인기",
      places: entry.results.map((r: any) => ({
        title: r.title.replace(/<[^>]+>/g, ""),
        address: r.roadAddress,
        link: r.link,
      })),
    }));

  console.log("🔥 [HOT PLACES] 구:", gu);
  console.log(
    "📥 OpenAI keyword result:",
    keywordRes.choices[0].message.content
  );
  console.log("📦 Parsed keywords:", keywords);
  console.log("🗺️ Naver search results:", searchResults);
  console.log("✅ Final hotPlaces:", hotPlaces);

  return NextResponse.json(hotPlaces);
}
