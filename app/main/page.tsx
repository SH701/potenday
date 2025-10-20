"use client";
import React, { useEffect, useState } from "react";
import { guData } from "@/lib/gudata";
import ChatWidget from "@/components/main/ChatWidget";
import Sidebar from "@/components/main/Sidebar";
import Top from "@/components/main/Top";
import StatsCards from "@/components/main/StatsCards";
import RecommendationList from "@/components/main/RecommendationList";
import EmptyState from "@/components/main/EmptyState";
import PlaceModal from "@/components/main/PlaceModal";
import HotPlaces from "@/components/main/HotPlaces";
import Onboarding from "@/components/etc/Onboarding";

interface WeatherData {
  main: {
    temp: number;
  };
}

export interface Recommendation {
  placeId: string;
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
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Recommendation | null>(null);
  const [personaSelected, setPersonaSelected] = useState<string | null>(null);
  useEffect(() => {
    const savePersona = localStorage.getItem("selectedPersona");
    setPersonaSelected(savePersona);
  }, []);

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

  const handleItemClick = (item: Recommendation) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };
  if (!personaSelected) {
    return <Onboarding onSelect={() => setPersonaSelected("selected")} />;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden ">
      <div className="hidden sm:block sm:w-72">
        <Sidebar
          search={search}
          setSearch={setSearch}
          selectedGu={selectedGu}
          setSelectedGu={setSelectedGu}
          hoveredGu={hoveredGu}
          setHoveredGu={setHoveredGu}
          isMobile={false}
          isOpen={false}
          setIsOpen={() => {}}
        />
      </div>

      <main className="flex-1 min-h-screen">
        <Top
          selectedGu={selectedGu}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Sidebar
          search={search}
          setSearch={setSearch}
          selectedGu={selectedGu}
          setSelectedGu={setSelectedGu}
          hoveredGu={hoveredGu}
          setHoveredGu={setHoveredGu}
          isMobile={true}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

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
              loading={loading}
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
