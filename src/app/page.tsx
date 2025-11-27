"use client";

import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen  overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[40%] left-[-10%] sm:top-60 sm:left-10 w-[300px] sm:w-[400px] lg:w-[480px] opacity-30 blur-sm animate-blob">
          <Image
            src="/login/namsan.png"
            alt="남산"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
        <div className="absolute top-10 right-0 sm:top-20 sm:right-20 w-[250px] sm:w-[400px] lg:w-[480px] opacity-30 blur-sm animate-blob animation-delay-2000">
          <Image
            src="/login/palace.png"
            alt="궁"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] sm:w-[400px] lg:w-[480px] opacity-30 blur-sm animate-blob animation-delay-1000">
          <Image
            src="/login/ddp.png"
            alt="DDP"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
      </div>

      {/* 헤더 */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-pink-400" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
            SeoulCourse
          </h1>
        </div>

        <div className="flex items-center gap-3 z-50">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base bg-white text-gray-900 shadow-md hover:bg-gray-100 transition">
                로그인
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base bg-white text-gray-900 shadow-md hover:bg-gray-100 transition">
                회원가입
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </header>

      {/* Hero 섹션 */}
      <section className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-4 sm:px-6 relative z-50">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600 bg-clip-text text-transparent leading-tight"
        >
          서울 속 나만의 하루
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-800 max-w-xl sm:max-w-2xl mb-10 text-base sm:text-lg leading-relaxed"
        >
          인기 카페와 맛집, 그리고 숨겨진 스팟까지.{" "}
          <br className="hidden sm:block" />
          AI가 당신의 취향을 이해하고, 딱 맞는 코스를 추천해드려요.
        </motion.p>

        <SignedOut>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <SignUpButton mode="modal" forceRedirectUrl="/main">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white shadow-lg hover:scale-105 transform transition-transform">
                지금 시작하기
              </button>
            </SignUpButton>
            <button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white shadow-lg hover:scale-105 transform transition-transform"
              onClick={() => router.push("/main")}
            >
              로그인 없이 시작하기
            </button>
          </motion.div>
        </SignedOut>
      </section>
    </main>
  );
}
