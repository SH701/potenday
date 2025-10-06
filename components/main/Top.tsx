"use client";

import { BookOpenText } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface HeaderProps {
  selectedGu: {
    name: string;
    vibe: string;
    hotspot: string;
  } | null;
}

export default function Top({ selectedGu }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-12 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            {selectedGu
              ? `${selectedGu.name} 탐험하기`
              : "오늘은 어디로 갈까요?"}
          </h2>
          <p className="text-gray-600">
            {selectedGu
              ? `${selectedGu.vibe} 분위기의 ${selectedGu.hotspot}`
              : "원하는 구를 선택해보세요"}
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => router.push("/post")}
          >
            <BookOpenText className="w-6 h-6 text-gray-600" />
          </button>
          <div className="p-3">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
