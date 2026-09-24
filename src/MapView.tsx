import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { Character, PooEvent } from "./domain";
import { pixelMapStyle } from "./pixelMapStyle";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapViewProps {
  events: PooEvent[];
  characters: Character[];
}

const fallbackCenter: [number, number] = [12.4964, 41.9028];

function createEventMarker(item: PooEvent, characters: Character[]) {
  const character = characters.find((candidate) => candidate.id === item.characterId);
  const marker = document.createElement("div");
  marker.className = `event-marker event-marker-${item.kind}`;
  marker.setAttribute("role", "img");
  marker.setAttribute("aria-label", `${item.kind === "pee" ? "Pipì" : "Cacca"}${character ? ` di ${character.name}` : ""}`);

  const initial = document.createElement("span");
  initial.className = "event-marker-initial";
  initial.textContent = character?.name.trim().charAt(0).toUpperCase() ?? "•";

  const icon = document.createElement("img");
  icon.className = "event-marker-icon";
  icon.src = item.kind === "pee" ? "/pixel-art/child-pee.svg" : "/pixel-art/poop-button.svg";
  icon.alt = "";

  marker.append(initial, icon);
  return marker;
}

export default function MapView({ events, characters }: MapViewProps) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!element.current) return;
    const points = events.filter((item) => item.latitude !== undefined && item.longitude !== undefined);
    const map = new maplibregl.Map({
      container: element.current,
      style: pixelMapStyle,
      center: points[0] ? [points[0].longitude!, points[0].latitude!] : fallbackCenter,
      zoom: points.length ? 13 : 5,
      minZoom: 2,
      maxZoom: 19,
      dragRotate: false,
      pitchWithRotate: false
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const markerElements: HTMLElement[] = [];
    map.on("load", () => {
      points.forEach((item) => {
        const markerElement = createEventMarker(item, characters);
        markerElements.push(markerElement);
        new maplibregl.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat([item.longitude!, item.latitude!])
          .setPopup(new maplibregl.Popup({ offset: 28 }).setText(
            `${item.kind === "pee" ? "Pipì" : "Cacca"}${characters.find((character) => character.id === item.characterId) ? ` · ${characters.find((character) => character.id === item.characterId)?.name}` : ""}`
          ))
          .addTo(map);
      });
      if (points.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        points.forEach((item) => bounds.extend([item.longitude!, item.latitude!]));
        map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      }
    });

    return () => {
      markerElements.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [events, characters]);

  return (
    <div className="map-wrap pixel-map-wrap">
      <div className="map pixel-map" ref={element} aria-label="Mappa pixel art degli eventi con posizione" />
      {!events.some((item) => item.latitude !== undefined && item.longitude !== undefined) && (
        <p className="map-empty">Gli eventi salvati con GPS appariranno qui.</p>
      )}
    </div>
  );
}
