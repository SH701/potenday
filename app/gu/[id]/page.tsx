// app/gu/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { Coffee, ShoppingBag, Camera } from "lucide-react";

const iconMap: any = {
  cafe: Coffee,
  restaurant: Coffee,
  shopping: ShoppingBag,
  culture: Camera,
  activity: Camera,
};

export default function GuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(`/api/recommendations/${id}`);
        const data = await res.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">추천 장소를 생성하는 중...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">구 코드: {id}</h1>

      <div className="space-y-4">
        {recommendations.map((rec: any, idx: number) => {
          const Icon = iconMap[rec.category] || Camera;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                  <p className="text-gray-600 mb-3">{rec.desc}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{rec.time}</span>
                    <span className="text-green-600 font-medium">
                      {rec.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
