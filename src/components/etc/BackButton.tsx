"use client";

import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="cursor-pointer">
      <ArrowBigLeft className="size-8 text-purple-600" />
    </button>
  );
}
