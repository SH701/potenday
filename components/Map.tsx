"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/navigation";

export default function SeoulMap2D() {
  const router = useRouter();

  return (
    <div className="w-full h-[700px] flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [126.978, 37.5665],
          scale: 100000,
        }}
        style={{
          width: "100%",
          height: "100%",
          marginTop: "10%",
          marginRight: "10%",
        }}
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
                    fill: "#33f16c",
                    stroke: "#111827",
                    strokeWidth: 0.7,
                    outline: "none",
                  },
                  hover: {
                    fill: "#10b981",
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
