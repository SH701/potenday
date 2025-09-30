"use client";

import { useState } from "react";

const options = [
  { id: "date", label: "데이트" },
  { id: "study", label: "카공" },
  { id: "food", label: "음식점" },
  { id: "healing", label: "힐링 장소" },
];

export default function Onboard() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: selected }),
    });
    if (res.ok) {
      window.location.href = "/home";
    } else {
      console.error("온보딩 실패");
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">관심사를 선택하세요</h1>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`p-4 border rounded-xl ${
              selected.includes(opt.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 rounded-xl bg-green-500 text-white"
      >
        시작하기
      </button>
    </div>
  );
}
