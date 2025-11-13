"use client";
import React from "react";
import ChatWidget from "@/components/main/ChatWidget";
import Sidebar from "@/components/main/Sidebar";
import Top from "@/components/main/Top";
import StatsCards from "@/components/main/StatsCards";
import RecommendationList from "@/components/main/RecommendationList";
import EmptyState from "@/components/main/EmptyState";
import PlaceModal from "@/components/main/PlaceModal";
import HotPlaces from "@/components/main/HotPlaces";
import { useRecommendations } from "@/features/recommendations/queries/useRecommendations";
import { useWeather } from "@/features/weather/queries/useWeather";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  // ✅ Zustand에서 상태 가져오기
  const { selectedGu, selectedItem, setSelectedItem } = useAppStore();

  // React Query
  const { data: recommendations = [], isLoading } = useRecommendations(
    selectedGu?.id || ""
  );
  const { data: weather } = useWeather(selectedGu?.name || "");

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-72">
        <Sidebar isMobile={false} />
      </div>

      <main className="flex-1 min-h-screen">
        <Top />
        <Sidebar isMobile={true} />

        {selectedGu ? (
          <div className="p-4 sm:p-8 lg:p-12 min-w-screen">
            <StatsCards
              rating={selectedGu.rating}
              vibe={selectedGu.vibe}
              hotspot={selectedGu.hotspot}
              weather={weather}
            />
            <RecommendationList
              recommendations={recommendations}
              loading={isLoading}
              selectedGuId={selectedGu.id}
              selectedGuColor={selectedGu.color}
              onItemClick={handleItemClick}
              guName={selectedGu.name}
            />
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white">
              <HotPlaces gu={selectedGu.name} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
        <ChatWidget />
      </main>

      <PlaceModal
        selectedItem={selectedItem}
        onClose={closeModal}
        guName={selectedGu?.name}
      />
    </div>
  );
}
