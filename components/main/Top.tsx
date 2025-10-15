"use client";
import { BookOpenText, Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface HeaderProps {
  selectedGu: { name: string; vibe: string; hotspot: string } | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
}

export default function Top({
  selectedGu,
  isSidebarOpen,
  setIsSidebarOpen,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex items-center justify-between gap-4">
        {/* 모바일 햄버거 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="sm:hidden p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
        >
          <Menu className="w-6 h-6 text-gray-900" />
        </button>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
            {selectedGu
              ? `${selectedGu.name} 탐험하기`
              : "오늘은 어디로 갈까요?"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 truncate">
            {selectedGu
              ? `${selectedGu.vibe} 분위기의 ${selectedGu.hotspot}`
              : "원하는 구를 선택해보세요"}
          </p>
        </div>

        <div className="flex items-center flex-shrink-0">
          <button
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => router.push("/post")}
          >
            <BookOpenText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <div className="p-2 sm:p-3">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
