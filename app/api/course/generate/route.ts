import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { famousgu } from "@/lib/gudata";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchNaver(query: string) {
  const res = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
      query
    )}&display=1`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );
  const data = await res.json();
  return data.items?.[0] || null;
}

function extractRegionFromMessage(message: string): string | null {
  const regions = Object.keys(famousgu);
  for (const region of regions) {
    if (message.includes(region)) {
      return region;
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message, weather, time, location, personaId } = await req.json();

    const requestedRegion = extractRegionFromMessage(message);

    const targetRegion =
      requestedRegion ||
      Object.keys(famousgu).find((gu) => location.includes(gu)) ||
      location;

    const areaHint =
      famousgu[targetRegion as keyof typeof famousgu] || targetRegion;
    const district = `${targetRegion}구`;

    const systemPrompt = `
너는 서울 여행 전문 도슨트야. 사용자의 요청에 따라 "${district}" 인근(같은 구 또는 인접 구)의 실제 장소로만 구성된 하루 여행 코스를 만들어줘.

📌 **입력 정보**
- 사용자 요청: "${message}"
- 현재 위치: ${location}
- **코스 목적지**: ${district}
- 주변 지역 힌트: ${areaHint}
- 시간: ${time}
- 날씨: ${weather || "정보 없음"}

📌 **코스 생성 원칙**
1. 반드시 "${district}" 혹은 그 인근(${areaHint})의 실제 장소명만 포함할 것.
2. "가로수길 카페"(X) → "앤트러사이트 가로수길점"(O)
3. 시간대 순서대로 구성 (ex. 10시 출발 → 12시 점심 → 14시 카페)
4. 구간 이동은 인접 지역 간 (ex. 도보 10분, 지하철 2호선 15분)
5. 총 3~5개 장소, 총 소요시간 4~6시간.
6. JSON만 반환. 코드블록( \`\`\` ) 절대 금지.

📌 **JSON 형식**
{
  "title": "코스명",
  "vibe": "분위기",
  "route": "장소명 → 장소명 → 장소명",
  "totalDuration": "총 소요 시간 (예: 5시간)",
  "spots": [
    {
      "name": "실제 존재하는 장소명 (반드시 ${district} 또는 ${areaHint} 지역)",
      "category": "카페|식당|관광지|쇼핑|문화공간",
      "arriveTime": "10:30",
      "stayTime": "1시간",
      "desc": "추천 이유 (시그니처 메뉴, 분위기 등)",
      "nextMove": "도보 10분, 지하철 2호선 등"
    }
  ]
}
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    const raw = res.choices[0].message.content ?? "{}";
    let course;

    try {
      const clean = raw
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      course = JSON.parse(clean);
    } catch (err) {
      console.error("⚠️ JSON parse error:", raw);
      return NextResponse.json(
        { error: "AI 응답 파싱 실패", raw },
        { status: 500 }
      );
    }

    const verifiedSpots = [];
    for (const s of course.spots) {
      const item = await searchNaver(s.name);

      verifiedSpots.push({
        name: s.name,
        category: s.category,
        arriveTime: s.arriveTime,
        stayTime: s.stayTime,
        desc: s.desc,
        nextMove: s.nextMove,
        address: item.address ?? "주소 정보 없음",
        link: item.link ?? null,
      });
    }

    if (verifiedSpots.length === 0) {
      return NextResponse.json(
        { error: `${district} 인근에서 유효한 장소를 찾지 못했습니다.` },
        { status: 404 }
      );
    }

    const generatedCourse = {
      title: course.title,
      vibe: course.vibe,
      route: course.route,
      totalDuration: course.totalDuration,
      spots: verifiedSpots,
    };

    return NextResponse.json({ course: generatedCourse });
  } catch (error) {
    console.error("❌ Error generating course:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
