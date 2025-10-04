"use client";

import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
export default function Page() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b  overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-60 left-10 w-120 h-120 rounded-full opacity-30 blur-xs animate-blob">
          <Image
            src="/namsan.png"
            alt="남산"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
        <div className="absolute top-20 right-20 w-120 h-120 rounded-full opacity-30 blur-xs animate-blob animation-delay-2000">
          <Image
            src="/palace.png"
            alt="궁"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
        <div className="absolute bottom-10 left-[37%] w-120 h-120 rounded-full opacity-30 blur-xs animate-blob animation-delay-1000">
          <Image
            src="/ddp.png"
            alt="DDP"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
      </div>
      <header className="flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-pink-400" />
          <h1 className="text-2xl font-extrabold tracking-wide">SeoulCourse</h1>
        </div>
        <div className="flex items-center gap-4 z-50">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-full font-semibold text-sm sm:text-base bg-white text-gray-900 shadow-lg hover:bg-gray-200 transition">
                로그인
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-5 py-2 rounded-full font-semibold text-sm sm:text-base bg-white text-gray-900 shadow-lg hover:bg-gray-200 transition">
                회원가입
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </header>
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 relative z-50">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-7xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-blue-800 to-[#08e6e6] bg-clip-text text-transparent"
        >
          서울 속 나만의 하루
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-800 max-w-2xl mb-10 text-lg leading-relaxed"
        >
          인기 카페와 맛집, 그리고 숨겨진 스팟까지. <br />
          AI가 당신의 취향을 이해하고, 딱 맞는 코스를 추천해드려요.
        </motion.p>

        <SignedOut>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SignUpButton mode="modal" forceRedirectUrl="/main">
              <button className="px-10 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-white shadow-lg hover:scale-105 transform transition-transform">
                지금 시작하기
              </button>
            </SignUpButton>
          </motion.div>
        </SignedOut>
      </section>
    </main>
  );
}
