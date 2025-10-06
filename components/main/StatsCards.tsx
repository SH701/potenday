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
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm text-gray-600">평점</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">{rating}</div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-sm text-gray-600">분위기</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{vibe}</div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">핫플</span>
        </div>
        <div className="text-xl font-bold text-gray-900">{hotspot}</div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600">날씨</span>
        </div>
        <div className="text-xl font-bold text-gray-900">
          {weather ? `${Math.round(weather.main.temp)}°C` : "로딩 중..."}
        </div>
      </div>
    </div>
  );
}
