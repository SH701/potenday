import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const { userId } = await auth(); // ✅ await 제거
    if (!userId) {
      return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { interests: true },
    });

    console.log("🔎 DB에서 가져온 user:", user);

    if (!user || !user.interests) {
      return NextResponse.json(
        { error: "관심사가 없습니다." },
        { status: 404 }
      );
    }

    let interests: string[] = [];
    if (Array.isArray(user.interests)) {
      interests = user.interests as string[];
    } else {
      console.error("⚠️ interests 형식이 배열이 아님:", user.interests);
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY 없음");
      return NextResponse.json({ error: "API Key 없음" }, { status: 500 });
    }

    const prompt = `서울에서 ${interests.join(
      ", "
    )}를 좋아하는 사람에게 맞는 하루 코스를 추천해줘.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (err: any) {
    console.error("🔥 API Error:", err);
    return NextResponse.json(
      { error: err.message || "서버 오류 발생" },
      { status: 500 }
    );
  }
}
