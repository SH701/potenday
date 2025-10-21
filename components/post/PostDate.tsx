"use client";

import { useEffect, useState } from "react";

export default function PostDate({ date }: { date: Date }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!date) return;

    const target = new Date(date);
    const diff = Date.now() - target.getTime();

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let formatted = "";
    if (minutes < 1) formatted = "방금 전";
    else if (minutes < 60) formatted = `${minutes}분 전`;
    else if (hours < 24) formatted = `${hours}시간 전`;
    else if (days < 7) formatted = `${days}일 전`;
    else
      formatted = target.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });

    setTimeAgo(formatted);
  }, [date]);

  return <span className="text-sm text-gray-500">{timeAgo}</span>;
}
