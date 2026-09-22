"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Story } from "@/data/executive/stories";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const TEXT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/></svg>`;
const VIDEO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="10 8 16 12 10 16 10 8"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>`;

function createMarkerElement(svg: string, bg: string): HTMLElement {
  const el = document.createElement("div");
  el.style.width = "28px";
  el.style.height = "28px";
  el.style.borderRadius = "50% 50% 50% 0";
  el.style.transform = "rotate(-45deg)";
  el.style.background = bg;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.boxShadow = `0 2px 8px ${bg}40, 0 0 0 2px white`;
  el.style.border = "2px solid white";
  el.style.cursor = "pointer";
  el.style.transition = "all 200ms ease";
  el.innerHTML = `<div style="transform:rotate(45deg);display:flex">${svg}</div>`;
  return el;
}

const DEFAULT_CENTER: [number, number] = [19, 1.5];
const DEFAULT_ZOOM = 3;

export default function StoriesMap({ stories, cluster, onSelect }: {
  stories: Story[];
  cluster: boolean;
  onSelect: (s: Story) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /* init map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollZoom: true,
      cooperativeGestures: true
    });

    map.on("load", () => {
      renderMarkers(map, stories, cluster);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* (re)render markers when data / cluster flag changes */
  const renderMarkers = (map: mapboxgl.Map, storiesToRender: Story[], useCluster: boolean) => {
    if (!map.isStyleLoaded()) return;

    // Remove only story markers (not cluster/other markers)
    document.querySelectorAll(".story-marker").forEach(el => {
      const parent = el.parentElement;
      if (parent) parent.remove();
    });

    // Remove existing source and layers if they exist
    if (map.getSource("stories")) {
      if (map.getLayer("story-clusters")) map.removeLayer("story-clusters");
      if (map.getLayer("story-cluster-count")) map.removeLayer("story-cluster-count");
      map.removeSource("stories");
    }

    // Create GeoJSON features from stories
    const features = storiesToRender.map((s, idx) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [s.lng, s.lat]
      },
      properties: {
        index: idx,
        name: s.name,
        location: s.location,
        type: s.type,
        id: s.id
      }
    }));

    // Add source with clustering options
    map.addSource("stories", {
      type: "geojson",
      data: {
        type: "FeatureCollection" as const,
        features
      },
      cluster: useCluster,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    if (useCluster) {
      // Add cluster layer
      map.addLayer({
        id: "story-clusters",
        type: "circle",
        source: "stories",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#60a5fa",
          "circle-radius": ["step", ["get", "point_count"], 20, 5, 30, 10, 40],
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "white"
        }
      });

      // Add cluster count layer
      map.addLayer({
        id: "story-cluster-count",
        type: "symbol",
        source: "stories",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count"],
          "text-font": ["Open Sans Semibold"],
          "text-size": 14
        },
        paint: {
          "text-color": "white"
        }
      });

      // Function to add individual story markers
      const addIndividualMarkers = () => {
        storiesToRender.forEach(s => {
          const isVideo = s.type === "Video story";
          const svg = isVideo ? VIDEO_SVG : TEXT_SVG;
          const bgColor = isVideo ? "#D45F2C" : "#60a5fa";

          const el = createMarkerElement(svg, bgColor);
          el.className = "story-marker";

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([s.lng, s.lat])
            .addTo(map);

          // Create popup
          const popup = new mapboxgl.Popup({ offset: [0, -15] })
            .setHTML(`<strong>${s.name}</strong><br/>${s.location}`);

          el.addEventListener("click", () => {
            map.flyTo({ center: [s.lng, s.lat], zoom: 6, duration: 1000 });
            popup.addTo(map);
            onSelectRef.current(s);
          });

          el.addEventListener("mouseenter", () => {
            el.style.opacity = "0.8";
            el.style.filter = "brightness(1.2)";
            popup.addTo(map);
          });

          el.addEventListener("mouseleave", () => {
            el.style.opacity = "1";
            el.style.filter = "brightness(1)";
            popup.remove();
          });

          el.style.cursor = "pointer";
          el.style.transition = "transform 200ms ease";
        });
      };

      // Function to remove individual markers
      const removeIndividualMarkers = () => {
        document.querySelectorAll(".story-marker").forEach(el => {
          const parent = el.parentElement;
          if (parent) parent.remove();
        });
      };

      // Handle zoom to show/hide individual markers
      const handleZoom = () => {
        const currentZoom = map.getZoom();
        if (currentZoom > 5) {
          // Show individual markers at zoom > 5
          if (document.querySelectorAll(".story-marker").length === 0) {
            addIndividualMarkers();
          }
        } else {
          // Hide individual markers at zoom <= 5
          removeIndividualMarkers();
        }
      };

      // Add click handler for clusters
      map.on("click", "story-clusters", (e) => {
        if (e.features && e.features.length > 0) {
          const cluster = e.features[0];
          const clusterSource = map.getSource("stories") as mapboxgl.GeoJSONSource;
          const clusterId = cluster.id;

          (clusterSource as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return;

            // Zoom in
            map.flyTo({
              center: (cluster.geometry as any).coordinates,
              zoom: zoom + 2,
              duration: 750
            });

            // Add individual markers after zoom completes
            setTimeout(() => {
              addIndividualMarkers();
            }, 800);
          });
        }
      });

      map.on("mouseenter", "story-clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "story-clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      // Add zoom handler to show/hide markers based on zoom level
      map.on("zoom", handleZoom);
    }
  };

  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      renderMarkers(mapRef.current, stories, cluster);
    }
  }, [stories, cluster]);

  const resetView = () => {
    if (!mapRef.current || !containerRef.current) return;

    // Remove individual markers
    document.querySelectorAll(".story-marker").forEach(el => {
      const parent = el.parentElement;
      if (parent) parent.remove();
    });

    // Remove old map
    mapRef.current.remove();

    // Create fresh map
    const newMap = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollZoom: true,
      cooperativeGestures: true
    });

    newMap.on("load", () => {
      renderMarkers(newMap, stories, cluster);
    });

    mapRef.current = newMap;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 480 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 480, borderRadius: 10 }} />
      <button
        onClick={resetView}
        title="Reset map view"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11.5,
          fontWeight: 700,
          color: "var(--brand-secondary)",
          backgroundColor: "white",
          border: "1px solid rgba(0,33,71,0.15)",
          borderRadius: 8,
          padding: "6px 11px",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)"
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#042C53" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset
      </button>
    </div>
  );
}
