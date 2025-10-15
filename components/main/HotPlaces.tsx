"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface Place {
  rank: number;
  name: string;
  tag: string;
  places?: {
    title: string;
    address: string;
    link: string;
  }[];
}

export default function HotPlaces({ gu }: { gu: string }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gu) return;

    const fetchHotPlaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hot-places?gu=${gu}`);
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error("🔥 HotPlaces fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotPlaces();
  }, [gu]);

  if (loading)
    return (
      <div className="text-center py-8 text-white/80">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-3"></div>
        {gu}의 인기 장소를 불러오는 중...
      </div>
    );

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7" />
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
          지금 {gu}에서 핫한 장소
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {places.map((p) => (
          <div
            key={p.rank}
            className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              #{p.rank}
            </div>
            <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-1">
              {p.name}
            </div>
            <div className="text-xs sm:text-sm text-white/80 line-clamp-1">
              {p.tag}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
