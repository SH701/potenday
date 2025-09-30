"use client";
import { useState, useEffect } from "react";
import SeoulMap2D from "@/components/Map";

export default function Home() {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 18 || hour < 6);
  }, []);

  return (
    <main
      className={`relative flex items-center justify-center w-full h-screen overflow-hidden transition-colors duration-500 ${
        isNight
          ? "bg-gradient-to-b from-indigo-950 via-blue-900 to-sky-800"
          : "bg-gradient-to-b from-sky-100 to-green-200"
      }`}
    >
      {/* 지도 (맨 밑에 배경처럼) */}
      <div className="absolute inset-0 z-0">
        <SeoulMap2D isNight={isNight} />
      </div>

      {/* 왼쪽 위 타이틀 */}
      <div className="absolute top-6 left-6 z-20">
        <h1
          className={`text-3xl font-extrabold tracking-tight drop-shadow ${
            isNight ? "text-white" : "text-green-500"
          }`}
        >
          서울에서 뭐하지?{" "}
          <span className={isNight ? "text-yellow-300" : "text-blue-600"}>
            {isNight ? "🌙" : "🌞"}
          </span>
        </h1>
        <p
          className={`text-sm mt-1 ${
            isNight ? "text-gray-300" : "text-gray-600"
          }`}
        >
          구를 클릭해서 추천을 확인해보세요
        </p>
      </div>
    </main>
  );
}
