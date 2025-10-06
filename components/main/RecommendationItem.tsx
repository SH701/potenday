"use client";

import { Coffee, Camera, Clock, ChevronRight, Utensils } from "lucide-react";

const iconMap: Record<string, any> = {
  Coffee,
  Utensils,
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
  onClick: () => void;
}

export default function RecommendationItem({
  item,
  color,
  onClick,
}: RecommendationItemProps) {
  const IconComponent = iconMap[item.icon] || Coffee;

  return (
    <div
      className="group flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
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
      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
    </div>
  );
}
