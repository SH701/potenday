"use client";

import {
  Coffee,
  Camera,
  Clock,
  ChevronRight,
  Utensils,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Coffee,
  Utensils,
  Camera,
  Star,
};

interface RecommendationItemProps {
  item: {
    placeId: string;
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
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const finalPlaceId =
          item.placeId || item.title.replace(/\s+/g, "-").toLowerCase();

        const response = await fetch("/api/stars/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId: finalPlaceId }),
        });
        const data = await response.json();
        setSaved(data.saved);
      } catch (error) {
        console.error("Failed to check saved status:", error);
      }
    };

    checkSaved();
  }, [item.placeId, item.title]);

  const save = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;
    const finalPlaceId =
      item.placeId || item.title.replace(/\s+/g, "-").toLowerCase();

    const newSavedState = !saved;
    setSaved(newSavedState);
    setIsLoading(true);

    try {
      const response = await fetch("/api/stars", {
        method: newSavedState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: finalPlaceId,
          title: item.title,
          desc: item.desc || "",
          icon: item.icon,
          time: item.time,
          price: item.price || "",
        }),
      });
      router.refresh();
      if (!response.ok) {
        setSaved(!newSavedState); // 실패시 롤백
        console.error("Failed to save");
      }
    } catch (error) {
      setSaved(!newSavedState); // 에러시 롤백
      console.error("Error saving:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex items-center gap-2 mb-2">
          <h4 className="sm:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors ">
            {item.title}
          </h4>
          <button
            onClick={save}
            disabled={isLoading}
            className="ml-auto p-1 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                saved
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        </div>
        <p className="text-gray-600 mb-3 text-sm sm:text-base">{item.desc}</p>
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
