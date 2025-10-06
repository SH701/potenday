"use client";

import { MapPin } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-16 h-16 text-purple-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          서울 탐험을 시작해보세요
        </h3>
        <p className="text-gray-600 text-lg">
          왼쪽에서 원하는 구를 선택하면 맞춤 추천을 받을 수 있어요
        </p>
      </div>
    </div>
  );
}
