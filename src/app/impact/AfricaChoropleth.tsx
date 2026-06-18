"use client";

import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { missionStudents } from "@/data/hemp/missionStudents";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Metric = "enrolled" | "graduated" | "inwork";
type Region = "all" | "east" | "west" | "southern" | "central" | "north";

const COUNTRY_BY_ISO: Record<number, string> = {
  646: "Rwanda",       404: "Kenya",        800: "Uganda",
  834: "Tanzania",     288: "Ghana",         566: "Nigeria",
  231: "Ethiopia",     710: "South Africa", 686: "Senegal",
  120: "Cameroon",     508: "Mozambique",   894: "Zambia",
  384: "Cote d'Ivoire", 716: "Zimbabwe",
};

const AFRICA_ISO = new Set([
  12, 24, 204, 72, 854, 108, 132, 120, 140, 148, 174, 178, 180, 384, 262,
  818, 226, 232, 748, 231, 266, 270, 288, 324, 624, 404, 426, 430, 434, 450,
  454, 466, 478, 480, 504, 508, 516, 562, 566, 646, 678, 686, 690, 694, 706,
  710, 728, 729, 834, 768, 788, 800, 894, 716,
]);

const REGION_ISO: Record<string, Set<number>> = {
  east:     new Set([231, 404, 646, 834, 800, 108, 262, 232, 706, 728]),
  west:     new Set([204, 854, 132, 384, 270, 288, 324, 624, 430, 466, 478, 562, 566, 686, 694, 768]),
  southern: new Set([24, 72, 748, 426, 450, 454, 480, 508, 516, 710, 894, 716]),
  central:  new Set([120, 140, 148, 178, 180, 226, 266, 678]),
  north:    new Set([12, 818, 434, 504, 729, 788]),
};

function lerp(t: number, a: number, b: number): number {
  return Math.round(a + t * (b - a));
}

function getColor(value: number, max: number, metric: Metric): string {
  if (!value || !max) return "#E5E7EB";
  const t = Math.min(value / max, 1);
  if (metric === "inwork")    return `rgb(${lerp(t,197,15)},${lerp(t,237,110)},${lerp(t,227,86)})`;
  if (metric === "graduated") return `rgb(${lerp(t,199,24)},${lerp(t,223,95)},${lerp(t,254,165)})`;
  return `rgb(${lerp(t,199,4)},${lerp(t,223,44)},${lerp(t,254,83)})`;
}

const METRICS: { key: Metric; label: string }[] = [
  { key: "enrolled",  label: "Enrolled"  },
  { key: "graduated", label: "Graduated" },
  { key: "inwork",    label: "In Work"   },
];

const REGIONS: { key: Region; label: string }[] = [
  { key: "all",      label: "All Africa"      },
  { key: "east",     label: "East Africa"     },
  { key: "west",     label: "West Africa"     },
  { key: "southern", label: "Southern Africa" },
  { key: "central",  label: "Central Africa"  },
  { key: "north",    label: "North Africa"    },
];

export default function AfricaChoropleth() {
  const [metric, setMetric] = useState<Metric>("enrolled");
  const [region, setRegion]  = useState<Region>("all");
  const [tooltip, setTooltip] = useState<{
    name: string; value: number; x: number; y: number;
  } | null>(null);

  const counts = useMemo(() => {
    const enrolled:  Record<string, number> = {};
    const graduated: Record<string, number> = {};
    const inwork:    Record<string, number> = {};
    for (const s of missionStudents) {
      if (s.status === "Active")
        enrolled[s.country] = (enrolled[s.country] || 0) + 1;
      if (s.status === "Completed")
        graduated[s.country] = (graduated[s.country] || 0) + 1;
      if (s.employment === "Employed" || s.employment === "Entrepreneur")
        inwork[s.country] = (inwork[s.country] || 0) + 1;
    }
    return { enrolled, graduated, inwork } as Record<Metric, Record<string, number>>;
  }, []);

  const current  = counts[metric];
  const maxVal   = Math.max(...Object.values(current), 1);
  const accent   = metric === "inwork" ? "#0F6E56" : "#185FA5";

  const topCountries = Object.entries(current)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {METRICS.map(m => (
            <button key={m.key} onClick={() => setMetric(m.key)} style={{
              padding: "4px 12px", borderRadius: 6, border: "1px solid",
              borderColor: metric === m.key ? accent : "rgba(0,33,71,0.12)",
              backgroundColor: metric === m.key ? accent : "transparent",
              color: metric === m.key ? "white" : "#4B5563",
              fontSize: 11, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}>
              {m.label}
            </button>
          ))}
        </div>
        <select
          value={region}
          onChange={e => setRegion(e.target.value as Region)}
          style={{
            padding: "4px 8px", borderRadius: 6,
            border: "1px solid rgba(0,33,71,0.12)",
            fontSize: 11, color: "#374151",
            backgroundColor: "white", cursor: "pointer",
          }}
        >
          {REGIONS.map(r => (
            <option key={r.key} value={r.key}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Map + sidebar */}
      <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>

        {/* Map */}
        <div style={{
          flex: 1, position: "relative", borderRadius: 8, overflow: "hidden",
          backgroundColor: "#EEF4FB",
        }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [22, 0], scale: 300 }}
            width={780}
            height={460}
            style={{ display: "block", width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter(geo => AFRICA_ISO.has(Number(geo.id)))
                  .map(geo => {
                    const isoNum   = Number(geo.id);
                    const name     = COUNTRY_BY_ISO[isoNum];
                    const val      = name ? (current[name] || 0) : 0;
                    const inRegion = region === "all" || (REGION_ISO[region]?.has(isoNum) ?? false);
                    const fill     = !inRegion
                      ? "#DADDE3"
                      : val > 0
                      ? getColor(val, maxVal, metric)
                      : "#E5E7EB";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="white"
                        strokeWidth={0.6}
                        style={{
                          default: { outline: "none" },
                          hover:   {
                            outline: "none",
                            fill: !inRegion ? "#DADDE3" : val > 0
                              ? getColor(Math.min(val * 1.2, maxVal), maxVal, metric)
                              : "#D1D5DB",
                            cursor: name && inRegion ? "pointer" : "default",
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseMove={(e) => {
                          if (name && inRegion) {
                            setTooltip({ name, value: val, x: e.clientX, y: e.clientY });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })
              }
            </Geographies>
          </ComposableMap>

          {tooltip && (
            <div style={{
              position: "fixed",
              left: tooltip.x + 12,
              top: tooltip.y - 38,
              backgroundColor: "#042C53",
              color: "white",
              padding: "5px 10px",
              borderRadius: 6,
              fontSize: 11,
              pointerEvents: "none",
              zIndex: 9999,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}>
              <strong>{tooltip.name}</strong>
              {tooltip.value > 0
                ? <> &mdash; {tooltip.value} {METRICS.find(m => m.key === metric)?.label.toLowerCase()}</>
                : <> &mdash; no data</>
              }
            </div>
          )}
        </div>

        {/* Sidebar: legend + top countries */}
        <div style={{
          width: 180, flexShrink: 0, display: "flex", flexDirection: "column",
          gap: 24, paddingTop: 6,
        }}>

          {/* Color scale */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Scale</p>
            <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
              <div style={{
                width: 12, height: 130, borderRadius: 4, flexShrink: 0,
                background: metric === "inwork"
                  ? "linear-gradient(to bottom, #0F6E56, #C5EDE3)"
                  : metric === "graduated"
                  ? "linear-gradient(to bottom, #185FA5, #C7DFFE)"
                  : "linear-gradient(to bottom, #042C53, #C7DFFE)",
              }} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 130 }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>High</span>
                <span style={{ fontSize: 10, color: "#6B7280" }}>Low</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#E5E7EB", border: "1px solid #D1D5DB", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#6B7280" }}>No data</span>
            </div>
          </div>

          {/* Top countries */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Top Countries</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {topCountries.map(([country, value]) => (
                <div key={country} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {country.length > 13 ? country.slice(0, 13) + "…" : country}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: accent, flexShrink: 0 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
