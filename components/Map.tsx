"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/navigation";
import { geoCentroid } from "d3-geo";

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
          {({ geographies, projection }) =>
            geographies.map((geo) => {
              const guName = geo.properties.SIG_KOR_NM;
              const centroid = geoCentroid(geo);
              const projected = projection(centroid);

              // null 체크
              if (!projected) return null;

              const [x, y] = projected;

              return (
                <g key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    onClick={() => {
                      const id = geo.properties.SIG_CD;
                      router.push(`/gu/${id}`);
                    }}
                    style={{
                      default: {
                        fill: "#52ee81",
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
                    className="cursor-pointer"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="black"
                    pointerEvents="none"
                    style={{ fontWeight: 600, fontSize: 12 }}
                  >
                    {guName}
                  </text>
                </g>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
