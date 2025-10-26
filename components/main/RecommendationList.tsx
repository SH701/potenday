"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import RecommendationItem from "./RecommendationItem";

interface Recommendation {
  placeId: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  price?: string;
  address:string
}

interface RecommendationListProps {
  recommendations: Recommendation[];
  loading: boolean;
  selectedGuId: string;
  selectedGuColor: string;
  guName: string;
  onItemClick: (item: Recommendation) => void;
}

export default function RecommendationList({
  recommendations,
  loading,
  selectedGuId,
  selectedGuColor,
  onItemClick,
}: RecommendationListProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:mb-8 mb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-900">AI 추천 장소</h3>
        </div>
        <button
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm transition-colors"
          onClick={() => router.push(`/gu/${selectedGuId}`)}
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
          recommendations.map((item, idx) => (
            <RecommendationItem
              key={idx}
              item={item}
              color={selectedGuColor}
              onClick={() => onItemClick(item)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            추천 정보를 불러올 수 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
