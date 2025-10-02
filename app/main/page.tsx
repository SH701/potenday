"use client";
import Chat from "@/components/Chat";
import Header from "@/components/Header";
import SeoulMap2D from "@/components/Map";

export default function Home() {
  return (
    <main
      className={
        "relative flex items-center justify-center w-full h-screen overflow-hidden transition-colors duration-500 bg-gradient-to-b from-sky-100 to-green-200"
      }
    >
      <div>
        <Header />
      </div>
      {/* 지도 (맨 밑에 배경처럼) */}
      <div className="absolute inset-0 z-0">
        <SeoulMap2D />
      </div>
      <div>
        <Chat />
      </div>
    </main>
  );
}
