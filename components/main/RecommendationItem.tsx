// components/main/RecommendationItem.tsx
"use client";

import { Coffee, ShoppingBag, Camera, Clock, ExternalLink } from "lucide-react";

const iconMap: Record<string, any> = {
  Coffee,
  ShoppingBag,
  Camera,
};

interface RecommendationItemProps {
  item: {
    icon: string;
    title: string;
    desc: string;
    time: string;
    price?: string;
  };
  color: string;
  guName?: string;
}

export default function RecommendationItem({
  item,
  color,
  guName,
}: RecommendationItemProps) {
  const IconComponent = iconMap[item.icon] || Coffee;

  const handleClick = () => {
    const searchQuery = guName ? `${item.title} ${guName}` : item.title;
    const searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(
      searchQuery
    )}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div
      className="group flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <IconComponent className="w-8 h-8" style={{ color }} />
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
          {item.price && (
            <div className="text-sm font-medium" style={{ color }}>
              {item.price}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium">네이버에서 보기</span>
        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
