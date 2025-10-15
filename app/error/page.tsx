"use client";

import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";

export default function Error() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <Lock className="w-14 h-14 text-purple-500" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          로그인 후 이용할 수 있습니다
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          저장 목록과 게시글 기능은 로그인한 사용자만 접근 가능합니다.
        </p>

        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition"
        >
          <LogIn className="w-5 h-5" />
          로그인하러 가기
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        계속해서 서비스를 이용하시려면 로그인해주세요.
      </p>
    </main>
  );
}
