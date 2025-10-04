"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Heart,
  Star,
  Coffee,
  ShoppingBag,
  Camera,
  ChevronRight,
  Clock,
  Flame,
  BookOpenText,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { guData } from "@/lib/gudata";

// 아이콘 매핑 객체
const iconMap: Record<string, any> = {
  Coffee,
  ShoppingBag,
  Camera,
};

export default function Home() {
  const [selectedGu, setSelectedGu] = useState<(typeof guData)[number] | null>(
    null
  );
  const [hoveredGu, setHoveredGu] = useState<string | null>(null);
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const filteredGuData = guData.filter((gu) => {
    const match = gu.name.toLowerCase().includes(search.toLowerCase());
    return match;
  });
  useEffect(() => {
    if (!selectedGu) return;

    setLoading(true);
    fetch(`/api/recommendations/${selectedGu.id}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedGu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-40">
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
                  ? "bg-[#DC4BAF] "
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

        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            내 저장 목록
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-72 min-h-screen">
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
            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
              <button
                className="pr-3 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => router.push("/post")}
              >
                <BookOpenText className="w-6 h-6 text-gray-600" />
              </button>
              <UserButton />
            </div>
          </div>
        </header>

        {selectedGu ? (
          <div className="p-12">
            {/* 상단 정보 카드 */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">평점</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {selectedGu.rating}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">분위기</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedGu.vibe}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">핫플</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedGu.hotspot}
                </div>
              </div>
            </div>

            {/* 추천 코스 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    AI 맞춤 추천 코스
                  </h3>
                </div>
                <button
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm transition-colors"
                  onClick={() => router.push(`/gu/${selectedGu.id}`)}
                >
                  전체 보기
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    추천 불러오는 중...
                  </div>
                ) : recommendations.length > 0 ? (
                  recommendations.map((item, idx) => {
                    const IconComponent = iconMap[item.icon] || Coffee;
                    return (
                      <div
                        key={idx}
                        className="group flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${selectedGu.color}20` }}
                        >
                          <IconComponent
                            className="w-8 h-8"
                            style={{ color: selectedGu.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 mb-3">{item.desc}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {item.time}
                            </div>
                            <div
                              className="text-sm font-medium"
                              style={{ color: selectedGu.color }}
                            >
                              {item.price}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    추천 정보를 불러올 수 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 트렌딩 */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-7 h-7" />
                <h3 className="text-2xl font-bold">지금 이 구에서 핫한 장소</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {["감성 카페 거리", "로컬 맛집 투어", "야경 명소"].map(
                  (place, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <div className="text-4xl font-bold mb-3">#{idx + 1}</div>
                      <div className="text-lg font-semibold mb-2">{place}</div>
                      <div className="text-sm text-white/80">실시간 인기</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-120px)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                서울 탐험을 시작해보세요
              </h3>
              <p className="text-gray-600 text-lg">
                왼쪽에서 원하는 구를 선택하면 맞춤 추천을 받을 수 있어요
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
