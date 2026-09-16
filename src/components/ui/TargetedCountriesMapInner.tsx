"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type CountryHub = {
  /** ISO 3166-1 alpha-3 code — filters the world GeoJSON down to these countries. */
  iso3: string;
  /** Display name shown on the map next to its marker. */
  name: string;
  coords: [number, number];
  isHQ: boolean;
};

/** Pakindo's verified target export markets — same list as `marketCountries` in src/i18n/routing.ts. */
const COUNTRIES: CountryHub[] = [
  { iso3: "IDN", name: "Indonesia", coords: [-6.2088, 106.8456], isHQ: true },
  { iso3: "IND", name: "India", coords: [28.6139, 77.209], isHQ: false },
  { iso3: "CHN", name: "China", coords: [39.9042, 116.4074], isHQ: false },
  { iso3: "SGP", name: "Singapore", coords: [1.3521, 103.8198], isHQ: false },
  { iso3: "MYS", name: "Malaysia", coords: [3.139, 101.6869], isHQ: false },
  { iso3: "PAK", name: "Pakistan", coords: [33.6844, 73.0479], isHQ: false },
  { iso3: "IRN", name: "Iran", coords: [35.6892, 51.389], isHQ: false },
  { iso3: "BGD", name: "Bangladesh", coords: [23.8103, 90.4125], isHQ: false },
  { iso3: "NPL", name: "Nepal", coords: [27.7172, 85.324], isHQ: false },
];

const TARGET_CODES = COUNTRIES.map((c) => c.iso3);

// The dot (+ pulse ring) stays exactly pinned to the geo-anchor via
// .radar-marker-container's own centering transform; the name label is an
// absolutely-positioned sibling hanging off its right edge, so adding a
// label never shifts the dot's precise position.
function hubMarkerHtml(hub: CountryHub) {
  return hub.isHQ
    ? `<div class="radar-marker-container relative flex items-center justify-center">
        <span class="pulse-ring-hq absolute h-8 w-8 rounded-full bg-amber-400 opacity-80 pointer-events-none"></span>
        <span class="relative h-3 w-3 rounded-full bg-amber-300 ring-2 ring-white shadow-[0_0_12px_#fbbf24]"></span>
        <span class="absolute top-1/2 left-full ml-2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-xs font-bold whitespace-nowrap text-amber-200 shadow-sm">
          ${hub.name}
          <span class="rounded bg-amber-500/30 px-1 py-px text-[9px] font-bold text-amber-300">HQ</span>
        </span>
      </div>`
    : `<div class="radar-marker-container relative flex items-center justify-center">
        <span class="pulse-ring absolute h-6 w-6 rounded-full bg-emerald-400 opacity-75 pointer-events-none"></span>
        <span class="relative h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-white shadow-[0_0_8px_#34d399]"></span>
        <span class="absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-md bg-slate-950/70 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-emerald-100 shadow-sm">
          ${hub.name}
        </span>
      </div>`;
}

export function TargetedCountriesMapInner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20.0, 83.0],
      zoom: 4,
      minZoom: 3,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 18 }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    let cancelled = false;
    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then((res) => res.json())
      .then((data: GeoJSON.FeatureCollection) => {
        if (cancelled) return;
        L.geoJSON(data, {
          filter: (feature) => TARGET_CODES.includes(feature.properties?.ISO_A3),
          style: (feature) => {
            const isHQ = feature?.properties?.ISO_A3 === "IDN";
            return {
              className: "glow-border",
              color: isHQ ? "#fbbf24" : "#34d399",
              weight: isHQ ? 2.6 : 2.0,
              opacity: 0.95,
              fillColor: isHQ ? "#f59e0b" : "#10b981",
              fillOpacity: isHQ ? 0.2 : 0.12,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.ADMIN || feature.properties?.name;
            const isHQ = feature.properties?.ISO_A3 === "IDN";

            const tooltipContent = isHQ
              ? `<strong>${name}</strong><br><span class="text-xs font-semibold text-amber-300">Global Headquarters</span>`
              : `<strong>${name}</strong><br><span class="text-xs text-emerald-300">Targeted Market</span>`;

            layer.bindTooltip(tooltipContent, {
              className: isHQ ? "leaflet-tooltip-custom leaflet-tooltip-hq" : "leaflet-tooltip-custom",
              direction: "center",
              permanent: false,
            });

            layer.on({
              mouseover: (e) => {
                (e.target as L.Path).setStyle({
                  fillOpacity: isHQ ? 0.35 : 0.28,
                  weight: 3.2,
                  color: isHQ ? "#fde68a" : "#6ee7b7",
                });
              },
              mouseout: (e) => {
                (e.target as L.Path).setStyle({
                  fillOpacity: isHQ ? 0.2 : 0.12,
                  weight: isHQ ? 2.6 : 2.0,
                  color: isHQ ? "#fbbf24" : "#34d399",
                });
              },
            });
          },
        }).addTo(map);
      })
      .catch(() => {
        // Country outlines are a decorative overlay layered on the tiles —
        // if the public GeoJSON fetch fails (offline, rate-limited), the
        // radar markers below still work fine on their own.
      });

    COUNTRIES.forEach((hub) => {
      const pingIcon = L.divIcon({
        className: "custom-hub-marker",
        html: hubMarkerHtml(hub),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      // No hover tooltip here — the marker's name label (in hubMarkerHtml)
      // is already always visible, so a tooltip would just repeat it.
      L.marker(hub.coords, { icon: pingIcon }).addTo(map);
    });

    return () => {
      cancelled = true;
      map.remove();
    };
  }, []);

  return (
    <div className="relative h-[820px] w-full overflow-hidden rounded-3xl bg-slate-900/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div ref={containerRef} className="z-10 h-full w-full bg-slate-950" />
    </div>
  );
}
