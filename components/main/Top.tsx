"use client";
import { BookOpenText, Menu, Bot, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GenerateCourseModal from "@/components/course/GenerateCourse";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const changeBot = () => {
    if (confirm("AI를 변경하시겠습니까?")) {
      localStorage.removeItem("selectedPersona");
      document.cookie = "selectedPersona=; path=/; max-age=0";
      router.push("/onboard");
    }
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex items-center justify-between gap-4">
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
            onClick={() => setIsModalOpen(true)}
            className="
          fixed bottom-24 right-4 sm:static
          z-50 flex items-center justify-center gap-2
          px-5 py-2.5 rounded-full font-semibold tracking-tight
          transition-all duration-300 ease-out
          bg-white/90 text-gray-800 backdrop-blur-md shadow-md border border-gray-200
          hover:bg-white hover:shadow-xl hover:scale-[1.03]
          active:scale-95
          sm:bg-gradient-to-r sm:from-purple-500 sm:to-pink-500 sm:text-white sm:border-none
          sm:hover:shadow-lg sm:hover:brightness-110
        "
          >
            {/* 모바일: 아이콘 */}
            <Sparkles className="w-6 h-6 sm:hidden" />
            {/* 데스크탑: 텍스트 */}
            <span className="hidden sm:inline text-sm font-semibold">
              ✨ AI 코스 생성
            </span>
          </button>
          <button
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => router.push("/post")}
          >
            <BookOpenText className="w-5 h-5 sm:w-6 sm:h-6 text-[#123452]" />
          </button>
          <div>
            <button
              className="sm:py-0 px-1 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={changeBot}
            >
              <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-[#14334e]" />
            </button>
          </div>
          <div className="p-2 sm:p-3">
            <UserButton />
          </div>
        </div>
      </div>
      <GenerateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
