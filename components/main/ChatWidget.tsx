"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([{ role: "ai", text: "안녕하세요!" }]);

  async function handleSend() {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: message }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    setMessage("");
  }

  return (
    <>
      {/* 열기 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-600"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">AI 가이드</h3>
                <p className="text-xs text-gray-500">
                  원하는 장소나 활동을 물어보세요!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-purple-500 text-white"
                    : "mr-auto bg-gray-100 text-gray-800"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* 입력창 */}
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              value={message}
              placeholder="메시지를 입력하세요..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      )}
    </>
  );
}
