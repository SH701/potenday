"use client";

import { getTodayKey } from "@/lib/date";
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
    address: string;
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

        const today = getTodayKey();
        const cacheKey = `saved-${finalPlaceId}`;
        const dateKey = `saved-date-${finalPlaceId}`;

        const cachedValue = localStorage.getItem(cacheKey);
        const cachedDate = localStorage.getItem(dateKey);

        if (cachedValue !== null && cachedDate === today) {
          setSaved(cachedValue === "true");
          return;
        }

        const response = await fetch("/api/stars/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId: finalPlaceId }),
        });
        const data = await response.json();
        setSaved(data.saved);

        localStorage.setItem(cacheKey, String(data.saved));
        localStorage.setItem(dateKey, today);
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
          address: item.address,
        }),
      });
      router.refresh();
      if (!response.ok) {
        setSaved(!newSavedState);
        console.error("Failed to save");
      }
    } catch (error) {
      setSaved(!newSavedState);
      console.error("Error saving:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group flex items-center gap-6 sm:p-6 px-3 py-2 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer relative"
      onClick={onClick}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <IconComponent className="w-8 h-8" style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center my-2">
          <h4 className="sm:text-xl font-bold text-[15px] truncate text-gray-900 group-hover:text-purple-600 transition-colors ">
            {item.title}
          </h4>
          <button
            onClick={save}
            disabled={isLoading}
            className="ml-auto p-1  transition-transform disabled:opacity-50 disabled:cursor-not-allowed absolute sm:static right-3"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Star
              className={`size-5 transition-colors ${
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
