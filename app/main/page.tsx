"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Sparkles,
  TrendingUp,
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
import ChatWidget from "@/components/main/ChatWidget";
import Sidebar from "@/components/main/Sidebar";

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
      <Sidebar
        search={search}
        setSearch={setSearch}
        selectedGu={selectedGu}
        setSelectedGu={setSelectedGu}
        hoveredGu={hoveredGu}
        setHoveredGu={setHoveredGu}
      />

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

        {/* AI 채팅 */}
        <ChatWidget />

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
