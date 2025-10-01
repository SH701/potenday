"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      { role: "assistant", content: "안녕! 나는 서울 코스 추천 도우미야 😊" },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.result },
    ]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] p-6 bg-white/80 rounded-2xl absolute right-12 bottom-[10%]">
      {/* 대화 영역 */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
              ✨ AI가 생각 중...
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="flex mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg p-2 mr-2"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
}
