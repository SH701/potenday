"use client";

import { ExternalLink } from "lucide-react";

interface MoveProps {
  star: {
    placeId: string;
    title: string;
  };
}

export default function Move({ star }: MoveProps) {
  const handleMapMove = () => {
    if (!star || !star.placeId) {
      console.error("Star data is missing.");
      return;
    }

    const url = `https://map.naver.com/v5/search/${encodeURIComponent(
      star.placeId
    )}`;

    window.open(url, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleMapMove}
      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
      aria-label={`${star.title} 네이버 지도로 이동`}
    >
      <ExternalLink className="w-4 h-4" />
      지도에서 보기
    </button>
  );
}
