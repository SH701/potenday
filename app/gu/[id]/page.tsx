"use client";

import { use } from "react";

export default function GuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold">구 코드: {id}</h1>
      <p className="mt-2 text-gray-600">
        🔥 {id} 구의 추천 콘텐츠를 보여줄 자리
      </p>
    </main>
  );
}
