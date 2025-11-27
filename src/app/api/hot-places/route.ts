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
너는 서울의 각 구별로 요즘 트렌디한 장소 키워드를 추천하는 어시스턴트야.
각 구의 특징(예: 분위기, 상권, 대학가, 주거지, 자연환경 등)을 고려해서
사람들이 실제로 자주 찾는 키워드 3개를 추천해.

- 네이버 지역검색에서 실제 결과가 나올 수 있는 **간단하고 일반적인 명사형 키워드**여야 해.
- 단, '카페', '맛집', '공원'처럼 단조로운 반복은 피하고, 
  같은 범주라도 구마다 어울리는 다른 키워드를 제시해.
- 예: 
  - 강남구 → ["브런치", "루프탑", "디저트"]
  - 마포구 → ["홍대거리", "펍", "플리마켓"]
  - 송파구 → ["잠실맛집", "쇼핑몰", "한강뷰"]
  - 관악구 → ["대학가", "분식", "스터디카페"]
- 반드시 JSON 형식으로 응답: {"keywords": ["키워드1", "키워드2", "키워드3"]}
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
  return NextResponse.json(hotPlaces);
}
