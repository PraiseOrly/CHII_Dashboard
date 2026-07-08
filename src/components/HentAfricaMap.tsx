"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COUNTRY_BY_ISO: Record<number, string> = {
  646: "Rwanda", 404: "Kenya", 800: "Uganda", 834: "Tanzania",
  288: "Ghana", 566: "Nigeria", 231: "Ethiopia", 710: "South Africa",
  686: "Senegal", 384: "Côte d'Ivoire", 894: "Zambia", 716: "Zimbabwe",
};

const AFRICA_ISO = new Set([
  12, 24, 204, 72, 854, 108, 132, 120, 140, 148, 174, 178, 180, 384, 262,
  818, 226, 232, 748, 231, 266, 270, 288, 324, 624, 404, 426, 430, 434, 450,
  454, 466, 478, 480, 504, 508, 516, 562, 566, 646, 678, 686, 690, 694, 706,
  710, 728, 729, 834, 768, 788, 800, 894, 716,
]);

const ACCENT = "#2D6A4F";

// Sequential green scale, deep (high) → light (low), by share of the max value
function getColor(value: number, max: number): string {
  if (!value || !max) return "#E5E7EB";
  const t = Math.min(value / max, 1);
  const lerp = (a: number, b: number) => Math.round(a + t * (b - a));
  // light #C8DDB5 → deep #1B4332
  return `rgb(${lerp(200, 27)}, ${lerp(221, 67)}, ${lerp(181, 50)})`;
}

export default function HentAfricaMap({
  data, region, onRegionChange, regions,
}: {
  data: { name: string; value: number }[];
  region?: string;
  onRegionChange?: (r: string) => void;
  regions?: string[];
}) {
  const current: Record<string, number> = {};
  data.forEach(d => { current[d.name] = d.value; });
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const [zoom, setZoom] = useState(1);
  const [mapKey, setMapKey] = useState(0);
  const [tooltip, setTooltip] = useState<{ name: string; value: number; x: number; y: number } | null>(null);
  const resetView = () => { setZoom(1); setMapKey(k => k + 1); };

  const topCountries = Object.entries(current).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      {/* Control row — matches the executive map */}
      {onRegionChange && regions && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 14 }}>
          <select value={region} onChange={e => onRegionChange(e.target.value)}
            style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(0,33,71,0.12)", fontSize: 11, color: "#374151", backgroundColor: "white", cursor: "pointer" }}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      )}
      <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>

        {/* Map */}
        <div style={{ flex: 1, position: "relative", borderRadius: 8, overflow: "hidden", backgroundColor: "#EEF4FB" }}>
          {/* Zoom controls */}
          <div style={{ position: "absolute", top: 8, left: 8, zIndex: 5, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "+", fn: () => setZoom(z => Math.min(z * 1.5, 8)) },
              { label: "−", fn: () => setZoom(z => Math.max(z / 1.5, 1)) },
            ].map(b => (
              <button key={b.label} onClick={b.fn} style={{
                width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(0,33,71,0.12)",
                backgroundColor: "white", color: "#374151", fontSize: 16, fontWeight: 600, lineHeight: 1,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}>{b.label}</button>
            ))}
            <button onClick={resetView} title="Reset map view" style={{
              width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(0,33,71,0.12)",
              backgroundColor: "white", color: "#374151", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
            </button>
          </div>

          <ComposableMap projection="geoMercator" projectionConfig={{ center: [20, 2], scale: 400 }}
            width={620} height={560} style={{ display: "block", width: "100%", height: "auto" }}>
            <ZoomableGroup key={mapKey} zoom={zoom} center={[20, 2]}
              onMoveEnd={(p: { zoom: number }) => setZoom(p.zoom)} minZoom={1} maxZoom={8}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies
                    .filter((geo) => AFRICA_ISO.has(Number(geo.id)))
                    .map((geo) => {
                      const name = COUNTRY_BY_ISO[Number(geo.id)];
                      const val = name ? (current[name] || 0) : 0;
                      const fill = val > 0 ? getColor(val, maxVal) : "#E5E7EB";
                      return (
                        <Geography key={geo.rsmKey} geography={geo} fill={fill}
                          stroke="white" strokeWidth={0.6}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: val > 0 ? getColor(Math.min(val * 1.2, maxVal), maxVal) : "#D1D5DB", cursor: name ? "pointer" : "default" },
                            pressed: { outline: "none" },
                          }}
                          onMouseMove={(e: React.MouseEvent) => { if (name) setTooltip({ name, value: val, x: e.clientX, y: e.clientY }); }}
                          onMouseLeave={() => setTooltip(null)} />
                      );
                    })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {tooltip && (
            <div style={{
              position: "fixed", left: tooltip.x + 12, top: tooltip.y - 38,
              backgroundColor: "#0F4C3A", color: "white", padding: "5px 10px", borderRadius: 6,
              fontSize: 11, pointerEvents: "none", zIndex: 9999, whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}>
              <strong>{tooltip.name}</strong>
              {tooltip.value > 0 ? <> &mdash; {tooltip.value} venture{tooltip.value === 1 ? "" : "s"}</> : <> &mdash; no data</>}
            </div>
          )}
        </div>

        {/* Sidebar: scale + top countries */}
        <div style={{ width: 180, flexShrink: 0, display: "flex", flexDirection: "column", gap: 24, paddingTop: 6 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Scale</p>
            <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
              <div style={{ width: 12, height: 80, borderRadius: 4, flexShrink: 0, background: "linear-gradient(to bottom, #1B4332, #C8DDB5)" }} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 80 }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>High</span>
                <span style={{ fontSize: 10, color: "#6B7280" }}>Low</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#E5E7EB", border: "1px solid #D1D5DB", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#6B7280" }}>No data</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Top Countries</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {topCountries.map(([country, value]) => (
                <div key={country} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {country.length > 13 ? country.slice(0, 13) + "…" : country}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
