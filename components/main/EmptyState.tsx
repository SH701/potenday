"use client";

import { MapPin } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          서울 탐험을 시작해보세요
        </h3>
        <p className="text-gray-600 text-base sm:text-lg">
          <span className="sm:hidden">
            왼쪽 상단 메뉴에서 원하는 구를 선택하면
          </span>
          <span className="hidden sm:inline">
            왼쪽에서 원하는 구를 선택하면
          </span>
          <br className="sm:hidden" />
          맞춤 추천을 받을 수 있어요
        </p>
      </div>
    </div>
  );
}
