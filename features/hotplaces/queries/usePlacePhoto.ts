"use client";

import { useQuery } from "@tanstack/react-query";
import { getMsUntilMidnight } from "@/lib/date";

export function usePlacePhoto(name: string) {
  return useQuery({
    queryKey: ["place-photo", name],
    queryFn: async () => {
      const res = await fetch(
        `/api/place-detail?query=${encodeURIComponent(name)}&count=1`
      );
      const data = await res.json();
      return data.detail?.photo ?? null;
    },
    staleTime: getMsUntilMidnight(), // 오늘 자정까지 캐싱
  });
}
