"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { personas } from "@/lib/persona";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personaName, setPersonaName] = useState("AI 가이드");
  const [personaimg, setPersonaimg] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "안녕하세요!" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const savedPersonaId = localStorage.getItem("selectedPersona");
    const persona = personas.find((p) => p.id === savedPersonaId);
    if (persona) {
      setPersonaName(persona.name);
      setPersonaimg(persona.image);
    }
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function typeAIMessage(fullText: string) {
    setLoading(false);
    let displayed = "";
    for (const char of fullText) {
      displayed += char;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          text: displayed,
        };
        return updated;
      });
      await new Promise((r) => setTimeout(r, 20));
    }
  }

  async function handleSend() {
    if (!message.trim()) return;
    const userMsg = message;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "",
        },
      ]);
      await typeAIMessage(data.reply);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <>
      {/* 열기 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:bottom-12 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-600 z-50"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>

      {/* 모바일 전체화면 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 채팅창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 h-[600px] sm:inset-auto sm:bottom-32 sm:right-16 sm:w-[400px] sm:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                {personaimg ? (
                  <Image
                    src={personaimg}
                    alt={personaName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MessageCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">
                  {personaName}
                </h3>
                <p className="text-xs  text-gray-500">
                  원하는 장소나 활동의 키워드를 입력하세요.
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

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] sm:max-w-[75%] w-fit ${
                  m.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                {/* 텍스트 메시지 */}
                <div
                  className={`px-3 py-2 rounded-xl text-sm sm:text-[15px]
                    break-words break-all whitespace-pre-line leading-relaxed
                    ${
                      m.role === "user"
                        ? "bg-purple-500 text-white whitespace-pre-wrap"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] sm:max-w-[75%] w-fit mr-auto bg-gray-100 text-gray-500 px-3 py-2 rounded-xl text-sm sm:text-base italic">
                AI가 생각 중이에요...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-gray-200"
          >
            <input
              type="text"
              value={message}
              placeholder="예: 합정 카페 추천해줘, 강남 맛집 추천해줘"
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </form>
        </div>
      )}
    </>
  );
}
