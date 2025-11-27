"use client";

import { useQuery } from "@tanstack/react-query";
import { getMsUntilMidnight } from "@/lib/date";

export function useGuRecommendations(id: string, category: string) {
  return useQuery({
    queryKey: ["recommend", id, category],
    queryFn: async () => {
      const res = await fetch(`/api/suggest/${id}?category=${category}`);
      const data = await res.json();
      return data.recommendations || [];
    },
    staleTime: getMsUntilMidnight(),
  });
}
