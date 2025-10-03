"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const headerVariants = {
  on: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Header() {
  const [isHide, setIsHide] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lateY = window.scrollY;
    const onscroll = () => {
      const diff = lateY - window.scrollY;
      setIsHide(diff < 0);
      lateY = window.scrollY;
    };
    window.addEventListener("scroll", onscroll);
    return () => window.removeEventListener("scroll", onscroll);
  }, []);

  // 메뉴 항목 정의
  const menuItems = [
    {
      key: "post",
      href: pathname === "/post" ? "/" : "/post",
      label: pathname === "/post" ? "Main" : "Post",
    },
  ];

  return (
    <header
      className={`fixed top-0 z-30 w-full left-0 sm:px-10 sm:pt-3
        backdrop-blur-md transition-transform duration-300 ${
          isHide ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <nav className="flex flex-row items-center justify-between">
        <div className="absolute top-6 left-6 z-20">
          <h1
            className={`text-3xl font-extrabold tracking-tight drop-shadow ${"text-green-500"}`}
          >
            서울에서 뭐하지? <span className={"text-blue-600"}>🌞</span>
          </h1>
          <p className={"text-gray-600 text-sm mt-1 "}>
            구를 클릭해서 추천을 확인해보세요
          </p>
        </div>

        {/* PC 메뉴 */}
        <motion.ul
          initial="init"
          animate="on"
          variants={headerVariants}
          className="flex ml-auto sm:px-7 px-3 py-5 items-end justify-end gap-5 lg:text-lg sm:text-sm text-xs"
        >
          {menuItems.map((item) => (
            <motion.li key={item.key}>
              <Link href={item.href} className="flex flex-row sm:gap-2 gap-1">
                <p className="hover:colorful transition-colors duration-300 pb-2">
                  {item.label}
                </p>
              </Link>
            </motion.li>
          ))}
          <motion.li>
            <UserButton afterSignOutUrl="/" />
          </motion.li>
        </motion.ul>
      </nav>
    </header>
  );
}
