import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { famousgu } from "@/lib/gudata";
import { cookies } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_GUEST = 3;

async function searchNaver(query: string) {
  try {
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
    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.[0] ?? null;
  } catch {
    return null;
  }
}

function extractRegionFromMessage(message: string | undefined): string | null {
  if (!message) return null;
  for (const region of Object.keys(famousgu)) {
    if (message.includes(region)) return region;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const cookieStore = cookies();

    const body = await req.json();
    const message: string = String(body.message ?? "").trim();
    const weather: string = body.weather ?? "";
    const time: string = body.time ?? "";
    const location: string = String(body.location ?? "").trim();

    if (!message)
      return NextResponse.json({ error: "message required" }, { status: 400 });

    // 익명 쿼터 체크
    const rawCount = cookieStore.get("guest_created_count")?.value;
    const count = rawCount ? parseInt(rawCount, 10) : 0;
    if (!userId && count >= MAX_GUEST) {
      return NextResponse.json(
        {
          ok: false,
          error: "guest_limit",
          guestRemaining: 0,
          message: "로그인 필요",
        },
        { status: 401 }
      );
    }

    const requestedRegion = extractRegionFromMessage(message);
    const foundFromLocation =
      location && Object.keys(famousgu).find((gu) => location.includes(gu));
    const targetRegion =
      requestedRegion ||
      foundFromLocation ||
      location ||
      Object.keys(famousgu)[0];

    const areaHint =
      famousgu[targetRegion as keyof typeof famousgu] || targetRegion;
    const district = targetRegion?.endsWith("구")
      ? targetRegion
      : `${targetRegion}구`;

    const systemPrompt = `
너는 서울 여행 전문 도슨트야. 사용자의 요청에 따라 "${district}" 인근(같은 구 또는 인접 구)의 실제 장소로만 구성된 하루 여행 코스를 만들어줘.

입력:
- 사용자 요청: "${message}"
- 현재 위치: ${location || "정보 없음"}
- 목적지: ${district}
- 주변 힌트: ${areaHint}
- 시간: ${time || "정보 없음"}
- 날씨: ${weather || "정보 없음"}

원칙:
1) 반드시 "${district}" 또는 인접(${areaHint})의 실제 장소명만 사용.
2) 시간 순으로 3~5개 장소, 총 소요 4~6시간.
3) JSON만 반환. 코드블록 금지.

형식:
{
  "title": "...",
  "vibe": "...",
  "route": "...",
  "totalDuration": "...",
  "spots": [
    { "name":"...", "category":"카페|식당|관광지|쇼핑|문화공간", "arriveTime":"", "stayTime":"", "desc":"", "nextMove":"" }
  ]
}
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    const raw = aiRes.choices?.[0]?.message?.content ?? "{}";
    const stripped = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const match = stripped.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : stripped;

    let course;
    try {
      course = JSON.parse(jsonText);
    } catch (err) {
      console.error("JSON parse error:", raw);
      return NextResponse.json(
        { error: "AI 응답 파싱 실패", raw },
        { status: 500 }
      );
    }

    if (!course || !Array.isArray(course.spots) || course.spots.length === 0) {
      return NextResponse.json(
        { error: "코스 스팟이 없습니다." },
        { status: 400 }
      );
    }

    const verifiedSpots = await Promise.all(
      course.spots.map(async (s: any) => {
        const name = String(s.name ?? "").trim();
        if (!name) {
          return { ...s, address: "주소 정보 없음", link: null };
        }
        const item = await searchNaver(name);
        return {
          name,
          category: s.category ?? null,
          arriveTime: s.arriveTime ?? null,
          stayTime: s.stayTime ?? null,
          desc: s.desc ?? null,
          nextMove: s.nextMove ?? null,
          address: item?.address ?? "주소 정보 없음",
          link: item?.link ?? null,
        };
      })
    );

    const anyValid = verifiedSpots.some(
      (v) => v.address !== "주소 정보 없음" || v.link
    );
    if (!anyValid) {
      return NextResponse.json(
        { error: `${district} 인근에서 유효한 장소를 찾지 못했습니다.` },
        { status: 404 }
      );
    }

    const generatedCourse = {
      title: course.title ?? `${district} 하루 코스`,
      vibe: course.vibe ?? "",
      route: course.route ?? verifiedSpots.map((p) => p.name).join(" → "),
      totalDuration: course.totalDuration ?? "",
      spots: verifiedSpots,
    };

    if (userId) {
      return NextResponse.json({
        ok: true,
        guestRemaining: null,
        course: generatedCourse,
      });
    }

    const newCount = count + 1;
    const maxAge = 60 * 60 * 24 * 365;
    const secureFlag = process.env.NODE_ENV === "production" ? "Secure; " : "";
    const res = NextResponse.json({
      ok: true,
      guestRemaining: Math.max(0, MAX_GUEST - newCount),
      course: generatedCourse,
    });
    res.headers.append(
      "Set-Cookie",
      `guest_created_count=${newCount}; Path=/; Max-Age=${maxAge}; HttpOnly; ${secureFlag}SameSite=Lax`
    );
    return res;
  } catch (error) {
    console.error("Error generating course:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
