import { useQuery } from "@tanstack/react-query";

export function useWeather(guName: string) {
  return useQuery({
    queryKey: ["weather", guName],
    queryFn: async () => {
      const res = await fetch(`/api/weather/${guName}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    enabled: !!guName,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });
}
