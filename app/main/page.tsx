"use client";
import Chat from "@/components/Chat";
import SeoulMap2D from "@/components/Map";

export default function Home() {
  return (
    <main
      className={
        "relative flex items-center justify-center w-full h-screen overflow-hidden transition-colors duration-500 bg-gradient-to-b from-sky-100 to-green-200"
      }
    >
      {/* 지도 (맨 밑에 배경처럼) */}
      <div className="absolute inset-0 z-0">
        <SeoulMap2D />
      </div>

      {/* 왼쪽 위 타이틀 */}
      <div className="absolute top-6 left-6 z-20">
        <h1
          className={`text-3xl font-extrabold tracking-tight drop-shadow ${"text-green-500"}`}
        >
          서울에서 뭐하지? <span className={"text-blue-600"}>🌞</span>
        </h1>
        <p className={"text-gray-600 text-sm mt-1 "}>
          구를 클릭해서 추천을 확인해보세요
        </p>
      </div>
      <div>
        <Chat />
      </div>
    </main>
  );
}
