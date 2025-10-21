"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { House } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed z-30 w-screen left-0 top-10 px-6 sm:px-10 flex justify-between">
      <div className=" top-6 left-6 z-20">
        <h1 className="sm:text-3xl  font-extrabold tracking-tight drop-shadow text-purple-500">
          당신의 서울 코스를 공유해보세요! 🌿
        </h1>
        <p className="text-gray-600 sm:text-sm mt-1 text-[11px]">
          내가 다녀온 장소를 남기고, 다른 사람의 코스를 둘러보세요.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/main" className=" rounded-xl transition-colors">
          <House className="w-6 h-6 text-gray-600" />
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
