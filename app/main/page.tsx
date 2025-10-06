"use client";

import React, { useEffect, useState } from "react";
import { guData } from "@/lib/gudata";
import ChatWidget from "@/components/main/ChatWidget";
import Sidebar from "@/components/main/Sidebar";
import HotPlaces from "@/components/main/HotPlaces";
import Top from "@/components/main/Top";
import StatsCards from "@/components/main/StatsCards";
import RecommendationList from "@/components/main/RecommendationList";
import EmptyState from "@/components/main/EmptyState";

interface WeatherData {
  main: {
    temp: number;
  };
}

export interface Recommendation {
  icon: string;
  title: string;
  desc: string;
  time: string;
  price?: string;
}

export default function Home() {
  const [selectedGu, setSelectedGu] = useState<(typeof guData)[number] | null>(
    null
  );
  const [hoveredGu, setHoveredGu] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!selectedGu) return;

    setLoading(true);
    fetch(`/api/recommendations/${selectedGu.id}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedGu]);

  useEffect(() => {
    if (!selectedGu) return;

    fetch(`/api/weather/${selectedGu.name}`)
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("날씨 불러오기 실패:", err));
  }, [selectedGu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        search={search}
        setSearch={setSearch}
        selectedGu={selectedGu}
        setSelectedGu={setSelectedGu}
        hoveredGu={hoveredGu}
        setHoveredGu={setHoveredGu}
      />

      <main className="ml-72 min-h-screen">
        <Top selectedGu={selectedGu} />
        <ChatWidget />

        {selectedGu ? (
          <div className="p-12">
            <StatsCards
              rating={selectedGu.rating}
              vibe={selectedGu.vibe}
              hotspot={selectedGu.hotspot}
              weather={weather}
            />

            <RecommendationList
              recommendations={recommendations}
              loading={loading}
              selectedGuId={selectedGu.id}
              selectedGuColor={selectedGu.color}
              guName={selectedGu.name}
            />

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
              <HotPlaces gu={selectedGu.name} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
