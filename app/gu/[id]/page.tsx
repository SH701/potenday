"use client";

import { useEffect, useState } from "react";
import {
  Coffee,
  Utensils,
  Camera,
  ShoppingBag,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Recommendation {
  title: string;
  address: string;
  category: string;
  keyword: string;
  icon: string;
  roadAddress?: string;
}

const iconMap = {
  Coffee: Coffee,
  Utensils: Utensils,
  Camera: Camera,
  ShoppingBag: ShoppingBag,
  Map: MapPin,
};

export default function GuPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/suggest/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [id]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
        <div className="text-xl font-medium text-gray-700">
          추천 장소를 생성하는 중...
        </div>
        <div className="text-sm text-gray-500 mt-2">
          AI가 최적의 장소를 찾고 있습니다
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 결과 없음
  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            추천 장소가 없습니다
          </h2>
          <p className="text-gray-600">
            해당 지역의 추천 장소를 찾을 수 없습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 장소</h1>
          <p className="text-gray-600">
            AI가 선정한 {recommendations.length}곳의 특별한 장소
          </p>
        </div>

        {/* 추천 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((place, index) => {
            const IconComponent =
              iconMap[place.icon as keyof typeof iconMap] || Camera;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                {/* 아이콘 헤더 */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
                  <div className="flex items-center justify-between">
                    <IconComponent className="w-10 h-10 text-white" />
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {place.keyword}
                    </span>
                  </div>
                </div>

                {/* 컨텐츠 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                    {place.title.replace(/<[^>]*>/g, "")}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                      <span className="line-clamp-2">{place.address}</span>
                    </div>

                    {place.roadAddress && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                        <span className="line-clamp-2 text-gray-500">
                          {place.roadAddress}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{place.category}</span>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => {
                      const query = encodeURIComponent(
                        place.title.replace(/<[^>]*>/g, "")
                      );
                      window.open(
                        `https://map.naver.com/v5/search/${query}`,
                        "_blank"
                      );
                    }}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    지도에서 보기
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 액션 */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-white text-gray-700 px-8 py-3 rounded-lg shadow hover:shadow-md transition font-medium"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    </main>
  );
}
