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
너는 서울 여행 전문 도슨트야. 사용자의 요청에 따라 **실제 장소명으로 구성된 하루 여행 코스**를 만들어줘.

📌 **입력 정보**
- 사용자 요청: "${message}"
- 현재 시간: ${time}
- 현재 위치: ${location}
- 날씨: ${weather || "정보 없음"}

📌 **코스 생성 원칙**
1. **실제 장소명 필수**: "가로수길 카페" (X) → "앤트러사이트 가로수길점" (O)
2. **시간대별 동선**: 10:00 출발 → 12:00 점심 → 14:00 카페 → 17:00 저녁 식으로 흐름 구성
3. **지리적 효율성**: 강남 → 홍대 → 강남 이런 식으로 왔다갔다 하지 말고, 한 지역씩 돌기
4. **현실적 체류**: 식사 1시간, 카페 40분, 관광지 1.5시간, 쇼핑 1시간
5. **구체적 이동 정보**: "도보 10분", "지하철 2호선 강남역 → 홍대입구역 25분"

📌 **실제 예시**
❌ 나쁜 예: "가로수길의 감성적인 카페", "한남동 이탈리안 레스토랑"
✅ 좋은 예: "연남토마 본점", "토속촌 삼계탕", "카페 온리", "성수동 대림창고"

📌 **JSON 형식** (반드시 이 형식만 반환)
{
  "title": "구체적 코스명 (예: 성수동 힙스터 카페 투어)",
  "vibe": "분위기 (예: 감성 넘치는 브런치 & 카페 데이트)",
  "route": "실제 장소명으로 연결 (예: 대림창고 → 어니언 성수 → 연남토마)",
  "totalDuration": "총 소요 시간 (예: 5시간)",
  "spots": [
    {
      "name": "실제 존재하는 장소명 (예: 카페 온리, 토속촌 삼계탕)",
      "category": "카페|식당|관광지|쇼핑|문화공간",
      "arriveTime": "도착 시간 (예: 10:30)",
      "stayTime": "체류 시간 (예: 1시간)",
      "desc": "왜 이 장소를 추천하는지 구체적으로 설명 (시그니처 메뉴, 분위기, 특징)",
      "nextMove": "다음 장소로 이동 수단 (예: 도보 5분, 지하철 2호선 15분)"
    }
  ]
}

⚠️ **필수 체크리스트**
- [ ] 모든 name은 "XX 카페" 같은 일반명사가 아닌 **실제 가게명/장소명**
- [ ] route는 실제 장소명을 → 로 연결
- [ ] 시간은 ${time}부터 시작해서 순차적으로 증가
- [ ] 지리적으로 가까운 장소끼리 묶음 (예: 성수동 3곳 → 한남동 2곳)
- [ ] JSON만 반환, 코드 블록(\`\`\`) 절대 금지
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7, 
    });

    let course;
    const raw = res.choices[0].message.content ?? "{}";

    try {
      const clean = raw
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      course = JSON.parse(clean);
    } catch (err) {
      console.error("⚠️ JSON parse error, raw content:", raw);
      return NextResponse.json(
        { error: "AI 응답 파싱 실패", raw },
        { status: 500 }
      );
    }

    
    const verifiedSpots = [];
    for (const s of course.spots) {
      const naver = await searchNaver(s.name);
      const item = naver.items?.[0];
      verifiedSpots.push({
        name: s.name,
        category: s.category,
        arriveTime: s.arriveTime,
        stayTime: s.stayTime,
        desc: s.desc,
        nextMove: s.nextMove,
        address: item?.address ?? "주소 정보 없음",
        link: item?.link ?? null,
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

    console.log("✅ Course created:", saved.id);
    return NextResponse.json({ course: saved });
  } catch (error) {
    console.error("❌ Error generating course:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
