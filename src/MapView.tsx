import { useEffect, useRef } from "react";
import type { PooEvent } from "./domain";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  events: PooEvent[];
}

export default function MapView({ events }: MapViewProps) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !element.current) return;
      const points = events.filter((item) => item.latitude !== undefined && item.longitude !== undefined);
      const center: [number, number] = points[0]
        ? [points[0].latitude!, points[0].longitude!]
        : [41.9028, 12.4964];
      map = L.map(element.current, { maxBounds: [[-85, -180], [85, 180]], maxBoundsViscosity: 1 }).setView(center, points.length ? 13 : 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      points.forEach((item) => {
        const icon = L.icon({
          iconUrl: item.kind === "pee" ? "/pixel-art/child-pee.svg" : "/pixel-art/poop-button.svg",
          iconSize: [42, 42],
          iconAnchor: [21, 38],
          popupAnchor: [0, -38]
        });
        L.marker([item.latitude!, item.longitude!], { icon })
          .addTo(map!)
          .bindPopup(item.kind === "pee" ? "Pipì" : "Cacca");
      });
      if (points.length > 1) {
        map.fitBounds(points.map((item) => [item.latitude!, item.longitude!] as [number, number]), { padding: [24, 24] });
      }
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [events]);

  return (
    <div className="map-wrap">
      <div className="map" ref={element} aria-label="Mappa degli eventi con posizione" />
      {!events.some((item) => item.latitude !== undefined) && <p className="map-empty">Gli eventi salvati con GPS appariranno qui.</p>}
    </div>
  );
}
