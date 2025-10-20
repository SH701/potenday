import { NextResponse } from "next/server";
import OpenAI from "openai";
import { personas } from "@/lib/persona";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchNaver(query: string) {
  const res = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
      query
    )}&display=3&sort=random`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );
  return res.json();
}

export async function POST(req: Request) {
  try {
    const { message, personaId } = await req.json();

    const persona = personas.find((p) => p.id === personaId) ?? personas[0];

    const keywordRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "너는 사용자의 문장에서 장소 검색 키워드를 1~3개로 추출하는 어시스턴트야. 결과는 쉼표로 구분된 단어로만 출력해.",
        },
        { role: "user", content: message },
      ],
    });

    const keyword =
      keywordRes.choices[0].message.content?.split(",")[0].trim() || message;
    const naverData = await searchNaver(keyword);

    const answerRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: persona.prompt,
        },
        {
          role: "user",
          content: `
사용자 요청: ${message}
검색 키워드: ${keyword}
검색 결과: ${JSON.stringify(naverData.items, null, 2)}

이 장소들 중 사용자의 취향과 도슨트 스타일에 맞는 곳을 2~3곳 추천하고,
짧은 설명(20자 이내)과 이유를 말해줘.`,
        },
      ],
    });

    const reply = answerRes.choices[0].message.content;

    return NextResponse.json({
      reply,
      persona: persona.name,
      imagePath: persona.image, 
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "AI 추천 생성 실패" }, { status: 500 });
  }
}
