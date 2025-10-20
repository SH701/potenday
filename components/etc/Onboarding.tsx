"use client";
import { useState } from "react";
import Image from "next/image";
import { personas } from "@/lib/persona";

interface OnboardingProps {
  onSelect: () => void; // ✅ 부모(Home)에서 넘겨주는 콜백
}

export default function Onboarding({ onSelect }: OnboardingProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    localStorage.setItem("selectedPersona", id);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        당신의 도슨트를 선택하세요
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelect(p.id)}
            className={`rounded-2xl border-2 p-4 text-left transition hover:scale-105 ${
              selected === p.id
                ? "border-purple-500 shadow-lg"
                : "border-gray-200"
            }`}
          >
            <Image
              src={p.image}
              alt={p.name}
              width={120}
              height={120}
              className="rounded-full mx-auto"
            />
            <h2 className="text-lg font-semibold text-center">{p.name}</h2>
            <p className="text-center text-sm text-gray-500 mb-2">{p.title}</p>
            <p className="text-sm text-gray-700 text-center">{p.description}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 flex flex-col items-center">
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">{selected}</span>
          </p>
          <button
            className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition"
            onClick={onSelect}
          >
            시작하기
          </button>
        </div>
      )}
    </main>
  );
}
