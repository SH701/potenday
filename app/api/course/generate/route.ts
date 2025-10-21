import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchNaver(query: string) {
  const r = await fetch(
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
  return r.json();
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message, weather, time, location, personaId } = await req.json();

    const systemPrompt = `
      너는 서울 여행 도슨트야.
      사용자의 요청("${message}"), 시간(${time}), 날씨(${weather}), 위치(${location})를 고려해
      실제 존재할 법한 서울의 장소 3~4개로 하루 코스를 만들어줘.
      이동 동선이 자연스럽게 이어지도록 구성하고, JSON으로 결과를 반환해.
      {
        "title": "코스 이름",
        "vibe": "테마/분위기",
        "spots": [
          { "name": "장소명", "desc": "짧은 설명", "time": "예상 방문시간" }
        ]
      }
    `;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.9,
    });

    const content = res.choices[0].message.content ?? "{}";
    const course = JSON.parse(content);

    // 2️⃣ 네이버 검색으로 실제 장소 검증 + 주소 추가
    const verifiedSpots = [];
    for (const s of course.spots) {
      const naver = await searchNaver(s.name);
      const item = naver.items?.[0];
      verifiedSpots.push({
        name: s.name,
        desc: s.desc,
        time: s.time,
        address: item?.address || "주소 정보 없음",
        link: item?.link || null,
      });
    }
    const saved = await db.course.create({
      data: {
        userId,
        personaId,
        title: course.title,
        vibe: course.vibe,
        spots: verifiedSpots,
      },
    });

    return NextResponse.json({ course: saved });
  } catch (error) {
    console.error("❌ Error generating course:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
