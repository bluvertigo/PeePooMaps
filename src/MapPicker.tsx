import { type MouseEvent, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Coordinates } from "./location";
import { pixelMapStyle } from "./pixelMapStyle";
import "maplibre-gl/dist/maplibre-gl.css";

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

function createPin() {
  const element = document.createElement("img");
  element.className = "pixel-map-marker picker-marker";
  element.src = "/pixel-art/map-pin.svg";
  element.alt = "Punto selezionato";
  return element;
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>();
  const marker = useRef<maplibregl.Marker>();
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
    if (!online || !element.current) return;

    const currentValue = value;
    const mapInstance = new maplibregl.Map({
      container: element.current,
      style: pixelMapStyle,
      center: currentValue
        ? [currentValue.longitude, currentValue.latitude]
        : [fallbackCenter.longitude, fallbackCenter.latitude],
      zoom: currentValue ? 13 : 5,
      minZoom: 2,
      maxZoom: 19,
      dragRotate: false,
      pitchWithRotate: false
    });
    map.current = mapInstance;
    mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapInstance.on("click", (event) => {
      onChange({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });
    });

    if (currentValue) {
      marker.current = new maplibregl.Marker({ element: createPin(), anchor: "bottom" })
        .setLngLat([currentValue.longitude, currentValue.latitude])
        .addTo(mapInstance);
    }

    return () => {
      marker.current?.remove();
      marker.current = undefined;
      mapInstance.remove();
      map.current = undefined;
    };
  }, [online]);

  useEffect(() => {
    if (!map.current || !value) return;
    const position: [number, number] = [value.longitude, value.latitude];
    if (marker.current) {
      marker.current.setLngLat(position);
    } else {
      marker.current = new maplibregl.Marker({ element: createPin(), anchor: "bottom" })
        .setLngLat(position)
        .addTo(map.current);
    }
    map.current.setCenter(position);
    map.current.setZoom(Math.max(map.current.getZoom(), 13));
  }, [value]);

  return (
    <div className="picker-wrap">
      {online && <div className="map-picker pixel-map" ref={element} aria-label="Seleziona il punto dell'evento sulla mappa" />}
      <div
        className={online ? "offline-picker" : "offline-picker visible"}
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
