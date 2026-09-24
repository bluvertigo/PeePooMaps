import { type MouseEvent, useEffect, useRef, useState } from "react";
import type { Coordinates } from "./location";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  value?: Coordinates;
  onChange: (coordinates: Coordinates) => void;
}

const fallbackCenter: Coordinates = { latitude: 41.9028, longitude: 12.4964 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function coordinatesFromPoint(event: MouseEvent, element: HTMLElement): Coordinates {
  const rect = element.getBoundingClientRect();
  return {
    latitude: clamp(90 - ((event.clientY - rect.top) / rect.height) * 180, -85, 85),
    longitude: clamp(((event.clientX - rect.left) / rect.width) * 360 - 180, -180, 180)
  };
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<import("leaflet").Map>();
  const marker = useRef<import("leaflet").Marker>();
  const fallback = useRef<HTMLDivElement>(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    addEventListener("online", handleOnline);
    addEventListener("offline", handleOffline);
    return () => {
      removeEventListener("online", handleOnline);
      removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!online) return;
    void import("leaflet").then((L) => {
      if (cancelled || !element.current) return;
      map.current = L.map(element.current, {
        maxBounds: [[-85, -180], [85, 180]],
        maxBoundsViscosity: 1
      }).setView(
        value ? [value.latitude, value.longitude] : [fallbackCenter.latitude, fallbackCenter.longitude],
        value ? 13 : 5
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        errorTileUrl: ""
      }).addTo(map.current);
      map.current.on("click", (event: import("leaflet").LeafletMouseEvent) => {
        onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng });
      });
      if (value) marker.current = L.marker([value.latitude, value.longitude]).addTo(map.current);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = undefined;
      marker.current = undefined;
    };
  }, [online]);

  useEffect(() => {
    if (!map.current || !value) return;
    marker.current?.setLatLng([value.latitude, value.longitude]);
    if (!marker.current) {
      void import("leaflet").then((L) => {
        if (map.current && value) marker.current = L.marker([value.latitude, value.longitude]).addTo(map.current);
      });
    }
    map.current.setView([value.latitude, value.longitude], Math.max(map.current.getZoom(), 13));
  }, [value]);

  return (
    <div className="picker-wrap">
      {online && <div className="map-picker" ref={element} aria-label="Seleziona il punto dell'evento sulla mappa" />}
      <div
        className={online ? "offline-picker" : "offline-picker visible"}
        ref={fallback}
        role="application"
        aria-label="Mappa offline minimale: clicca per selezionare il punto"
        onClick={(event) => onChange(coordinatesFromPoint(event, event.currentTarget))}
      >
        <span>MAPPA OFFLINE</span>
        <small>Clicca per scegliere il punto</small>
        {value && <i style={{ left: `${((value.longitude + 180) / 360) * 100}%`, top: `${((90 - value.latitude) / 180) * 100}%` }} />}
      </div>
      {value ? <p className="coordinates" role="status">Punto scelto: {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}</p> : <p className="coordinates required">Scegli un punto sulla mappa prima di salvare.</p>}
    </div>
  );
}
