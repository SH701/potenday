"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/navigation";

export default function SeoulMap2D({ isNight }: { isNight: boolean }) {
  const router = useRouter();

  return (
    <div className="w-full h-[700px] flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [126.978, 37.5665],
          scale: 80000,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography="/seoul-gu.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  const guId = geo.properties.SIG_CD;
                  router.push(`/gu/${guId}`);
                }}
                style={{
                  default: {
                    fill: isNight ? "#1e3a8a" : "#3b82f6", // 밤: 네이비, 낮: 블루
                    stroke: isNight ? "#f3f4f6" : "#111827", // 밤: 밝은 테두리, 낮: 진한 테두리
                    strokeWidth: 0.7,
                    outline: "none",
                  },
                  hover: {
                    fill: isNight ? "#fbbf24" : "#10b981", // 밤: 노랑, 낮: 민트
                    stroke: "#000",
                    strokeWidth: 1,
                    outline: "none",
                  },
                  pressed: {
                    fill: "#ef4444",
                    stroke: "#000",
                    strokeWidth: 1,
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
