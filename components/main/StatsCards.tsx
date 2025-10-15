// components/main/StatsCards.tsx
"use client";

import { Star, Flame, MapPin, Sun } from "lucide-react";

interface StatsCardsProps {
  rating: number;
  vibe: string;
  hotspot: string;
  weather: {
    main: { temp: number };
  } | null;
}

export default function StatsCards({
  rating,
  vibe,
  hotspot,
  weather,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm ">평점</span>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
          {rating}
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          <span className="text-sm">분위기</span>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
          {vibe}
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          <span className="text-sm">핫플</span>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
          {hotspot}
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          <span className="text-sm">날씨</span>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
          {weather ? `${Math.round(weather.main.temp)}°C` : "로딩 중..."}
        </div>
      </div>
    </div>
  );
}
