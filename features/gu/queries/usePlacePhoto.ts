"use client";

import { useQuery } from "@tanstack/react-query";
import { getMsUntilMidnight } from "@/lib/date";

export function usePlacePhoto(name: string) {
  const clean = name.replace(/<[^>]*>/g, "");
  return useQuery({
    queryKey: ["photo", clean],
    queryFn: async () => {
      const res = await fetch(
        `/api/place-detail?query=${encodeURIComponent(clean)}&count=1`
      );
      const data = await res.json();
      return data.detail?.photo ?? null;
    },
    staleTime: getMsUntilMidnight(),
  });
}
