"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { House } from "lucide-react";

const headerVariants = {
  on: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Header() {
  const [isHide, setIsHide] = useState(false);

  return (
    <header className="fixed  z-30 w-full left-0 sm:px-10 flex justify-between top-10">
      <div className=" top-6 left-6 z-20">
        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow text-purple-500">
          오늘, 당신의 서울 코스를 공유해보세요! 🌿
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          내가 다녀온 장소를 남기고, 다른 사람의 코스를 둘러보세요.
        </p>
      </div>

      {/* PC 메뉴 */}

      <div className="flex items-center gap-4">
        <Link href="/main" className=" rounded-xl transition-colors">
          <House className="w-6 h-6 text-gray-600" />
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
