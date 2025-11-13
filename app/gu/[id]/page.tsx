"use client";

import { MapPin, Clock, AlertCircle, ImageIcon } from "lucide-react";
import { guData } from "@/lib/gudata";
import { useRouter } from "next/navigation";
import BackButton from "@/components/etc/BackButton";
import { Key, useState } from "react";
import { useGuRecommendations } from "@/features/gu/queries/useGuRecommendations";
import { usePlacePhoto } from "@/features/gu/queries/usePlacePhoto";

type CategoryType = "cafe" | "restaurant" | "attraction";

const categoryInfo = {
  cafe: {
    label: "카페",
    color: "from-purple-500 to-pink-500",
  },
  restaurant: {
    label: "식당",
    color: "from-pink-500 to-red-500",
  },
  attraction: {
    label: "놀거리",
    color: "from-purple-600 to-blue-500",
  },
};

function MainRecommendation({ place }: { place: any }) {
  const mainTitle = place.title.replace(/<[^>]*>/g, "");
  const { data: mainPhoto } = usePlacePhoto(mainTitle);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl sm:p-6 mb-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={mainTitle}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-purple-400" />
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 px-5 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{mainTitle}</h2>
          <p className="text-gray-600 mb-3">{place.keyword}</p>

          <div className="flex items-start gap-2 text-gray-700 mb-3">
            <MapPin className="w-4 h-4 text-purple-600 mt-1" />
            <span className="text-base truncate">{place.address}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm">{place.category}</span>
          </div>

          <button
            onClick={() =>
              window.open(
                `https://map.naver.com/v5/search/${encodeURIComponent(
                  mainTitle
                )}`,
                "_blank"
              )
            }
            className="mt-5 w-full bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition"
          >
            지도에서 보기
          </button>
        </div>
      </div>
    </div>
  );
}

function SubRecommendationCard({ place }: { place: any }) {
  const title = place.title.replace(/<[^>]*>/g, "");
  const { data: photo } = usePlacePhoto(title);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {photo ? (
        <img src={photo} alt={title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-purple-400" />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-3">{place.keyword}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {place.address}
        </p>

        <button
          onClick={() =>
            window.open(
              `https://map.naver.com/v5/search/${encodeURIComponent(title)}`,
              "_blank"
            )
          }
          className="w-full bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition"
        >
          지도에서 보기
        </button>
      </div>
    </div>
  );
}

export default function GuPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("restaurant");

  const gu = guData.find((g) => g.id === id);
  const guName = gu ? gu.name : "알 수 없는 지역";
  const router = useRouter();

  const {
    data: recommendations = [],
    isLoading,
    error,
    refetch,
  } = useGuRecommendations(id, activeCategory);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
        <div className="text-xl font-medium text-gray-700">
          추천 장소를 불러오는 중...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">데이터를 불러오지 못했습니다.</p>
          <button
            onClick={() => refetch()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );

  if (!recommendations.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            추천 장소가 없습니다
          </h2>
        </div>
      </div>
    );

  const main = recommendations[0];
  const sub = recommendations.slice(1, 4);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 카테고리 */}
        <div className="flex gap-6 mb-10 justify-center items-center">
          <button
            onClick={() => router.push("/main")}
            className="absolute left-8"
          >
            <BackButton />
          </button>

          {(Object.keys(categoryInfo) as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`p-3 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat
                  ? `bg-gradient-to-r ${categoryInfo[cat].color} text-white shadow-lg`
                  : "bg-white text-purple-600 border-2 border-purple-200"
              }`}
            >
              <p className="font-semibold">{categoryInfo[cat].label}</p>
            </button>
          ))}
        </div>

        <div className="flex my-4">
          <MapPin className="w-8 h-8 text-purple-600 mt-1" />
          <h2 className="text-xl font-bold pt-1 pl-2">{guName}의 추천 장소</h2>
        </div>

        <MainRecommendation place={main} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sub.map((place: unknown, i: Key | null | undefined) => (
            <SubRecommendationCard key={i} place={place} />
          ))}
        </div>
      </div>
    </main>
  );
}
