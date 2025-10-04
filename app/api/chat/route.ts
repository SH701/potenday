import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchNaver(query: string) {
  const r = await fetch(
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
  return r.json();
}

export async function POST(req: Request) {
  const { message } = await req.json();
  const keywordRes = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "너는 사용자의 요청에서 장소 검색 키워드를 뽑는 어시스턴트야.",
      },
      { role: "user", content: message },
    ],
  });

  const keyword = keywordRes.choices[0].message.content?.trim() || message;
  const naverData = await searchNaver(keyword);
  const answerRes = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "너는 사용자의 취향에 맞는 장소를 추천하는 AI 가이드야.",
      },
      {
        role: "user",
        content: `사용자 요청: ${message}\n\n검색 결과: ${JSON.stringify(
          naverData.items,
          null,
          2
        )}`,
      },
    ],
  });

  return NextResponse.json({ reply: answerRes.choices[0].message.content });
}
