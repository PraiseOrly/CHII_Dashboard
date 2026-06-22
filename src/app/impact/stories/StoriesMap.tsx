"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Story } from "./_data";

/* marker glyphs — icon differentiates type (not colour alone) */
const TEXT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/></svg>`;
const VIDEO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="10 8 16 12 10 16 10 8"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>`;

function pin(svg: string, bg: string) {
  return `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white"><div style="transform:rotate(45deg);display:flex">${svg}</div></div>`;
}

const DEFAULT_CENTER: [number, number] = [1.5, 19];
const DEFAULT_ZOOM = 3;

export default function StoriesMap({ stories, cluster, onSelect }: {
  stories: Story[];
  cluster: boolean;
  onSelect: (s: Story) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /* init map once */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(containerRef.current, { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, scrollWheelZoom: true, zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors", maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      renderMarkers();
    })();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* (re)render markers when data / cluster flag changes */
  const renderMarkers = () => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (layerRef.current) { map.removeLayer(layerRef.current); layerRef.current = null; }

    const group: LayerGroup = cluster
      ? (L as any).markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 })
      : L.layerGroup();

    stories.forEach(s => {
      const icon = L.divIcon({
        html: pin(s.type === "Video story" ? VIDEO_SVG : TEXT_SVG, s.type === "Video story" ? "#7C3AED" : "#185FA5"),
        className: "story-pin", iconSize: [28, 28], iconAnchor: [14, 28],
      });
      const m = L.marker([s.lat, s.lng], { icon });
      m.on("click", () => onSelectRef.current(s));
      m.bindTooltip(`${s.name} — ${s.location}`, { direction: "top", offset: [0, -26] });
      group.addLayer(m);
    });

    group.addTo(map);
    layerRef.current = group;
  };

  useEffect(() => { renderMarkers(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [stories, cluster]);

  const resetView = () => mapRef.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 480 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 480, borderRadius: 10 }} />
      <button onClick={resetView} title="Reset map view"
        style={{ position: "absolute", top: 10, right: 10, zIndex: 500, display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: "#042C53", backgroundColor: "white", border: "1px solid rgba(0,33,71,0.15)",
          borderRadius: 8, padding: "6px 11px", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#042C53" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
        Reset
      </button>
    </div>
  );
}
