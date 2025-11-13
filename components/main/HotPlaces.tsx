"use client";

import { TrendingUp, ImageIcon } from "lucide-react";
import { useHotPlaces } from "@/features/hotplaces/queries/useHotPlaces";
import { usePlacePhoto } from "@/features/hotplaces/queries/usePlacePhoto";

interface Place {
  rank: number;
  name: string;
  tag: string;
}

export default function HotPlaces({ gu }: { gu: string }) {
  const { data, isLoading, error } = useHotPlaces(gu);

  if (isLoading)
    return (
      <div className="text-center py-8 text-white/80">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-3"></div>
        {gu}의 인기 장소를 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-300">
        데이터를 불러오지 못했습니다.
      </div>
    );

  const places: Place[] = data ?? [];

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7" />
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
          지금 {gu}에서 핫한 장소
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {places.map((p) => {
          const title = p.name;
          const { data: photo } = usePlacePhoto(title);

          return (
            <div
              key={p.rank}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden p-0 hover:bg-white/20 transition-colors cursor-pointer"
            >
              {/* 🔥 사진 영역 */}
              {photo ? (
                <img
                  src={photo}
                  alt={title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-purple-400" />
                </div>
              )}

              {/* 텍스트 영역 */}
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                  #{p.rank}
                </div>
                <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-1">
                  {title}
                </div>
                <div className="text-xs sm:text-sm text-white/80 line-clamp-1">
                  {p.tag}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
