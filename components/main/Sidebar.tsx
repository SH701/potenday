"use client";

import { MapPin, Search, ChevronRight } from "lucide-react";
import { guData } from "@/lib/gudata";
import { useRouter } from "next/navigation";

type SidebarProps = {
  search: string;
  setSearch: (v: string) => void;
  selectedGu: (typeof guData)[number] | null;
  setSelectedGu: (gu: (typeof guData)[number]) => void;
  hoveredGu: string | null;
  setHoveredGu: (id: string | null) => void;
};

export default function Sidebar({
  search,
  setSearch,
  selectedGu,
  setSelectedGu,
  hoveredGu,
  setHoveredGu,
}: SidebarProps) {
  const filteredGuData = guData.filter((gu) => {
    const keyword = (search || "").toLowerCase();
    return gu.name.toLowerCase().includes(keyword);
  });
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seoul Spot</h1>
            <p className="text-xs text-gray-500">당신만의 서울 발견</p>
          </div>
        </div>

        {/* 검색창 */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="구 검색..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* 구 리스트 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-semibold text-gray-500 mb-3 px-2">
          전체 구 {search && `(${filteredGuData.length})`}
        </div>
        {filteredGuData.map((gu) => (
          <button
            key={gu.id}
            onClick={() => setSelectedGu(gu)}
            onMouseEnter={() => setHoveredGu(gu.id)}
            onMouseLeave={() => setHoveredGu(null)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all ${
              selectedGu?.id === gu.id
                ? "bg-[#DC4BAF]"
                : hoveredGu === gu.id
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                selectedGu?.id === gu.id
                  ? "bg-white/20 text-white"
                  : "text-white"
              }`}
              style={{
                backgroundColor:
                  selectedGu?.id === gu.id ? "transparent" : gu.color,
              }}
            >
              {gu.name[0]}
            </div>
            <div className="flex-1 text-left">
              <div
                className={`font-semibold text-sm ${
                  selectedGu?.id === gu.id ? "text-white" : "text-gray-900"
                }`}
              >
                {gu.name}
              </div>
              <div
                className={`text-xs ${
                  selectedGu?.id === gu.id ? "text-white/80" : "text-gray-500"
                }`}
              >
                {gu.hotspot}
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 ${
                selectedGu?.id === gu.id ? "text-white" : "text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>

      {/* 저장목록 버튼 */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          onClick={() => router.push("/me")}
        >
          내 저장 목록
        </button>
      </div>
    </aside>
  );
}
