"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface GenerateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateCourseModal({
  isOpen,
  onClose,
}: GenerateCourseModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any | null>(null);

  const handleGenerate = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/course/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          weather: "맑음",
          time: "오후 3시",
          location: "서울 강남",
          personaId: "ruby",
        }),
      });

      const data = await res.json();
      setCourse(data.course);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ✨ AI 하루 코스 생성기
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              AI가 당신의 하루 코스를 만들어드립니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="예: 오늘 오후에 감성적인 데이트 코스 짜줘"
            className="w-full p-4 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={4}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !message.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? "코스 생성 중..." : "🎯 코스 생성하기"}
          </button>

          {course && (
            <div className="mt-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl shadow-md p-6 space-y-4 border border-purple-100">
              <h3 className="font-bold text-xl text-gray-900">
                {course.title}
              </h3>
              <ul className="space-y-4 mt-4">
                {course.spots.map((spot: any, i: number) => (
                  <li
                    key={i}
                    className="bg-white rounded-lg p-4 border-l-4 border-purple-400 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-900">{spot.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{spot.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
