"use client";

import { useQuery } from "@tanstack/react-query";
import { getMsUntilMidnight } from "@/lib/date";

export function useRecommendations(guId: string) {
  return useQuery({
    queryKey: ["recommend-place", guId],
    queryFn: async () => {
      const res = await fetch(`/api/recommendations/${guId}`);
      const data = await res.json();
      return data.recommendations || [];
    },
    enabled: !!guId, // guId가 있을 때만 실행
    staleTime: getMsUntilMidnight(),
  });
}
