import type { StyleSpecification } from "maplibre-gl";

export const pixelMapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
      attribution: "© OpenStreetMap contributors · OpenFreeMap"
    }
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#bdeaff" }
    },
    {
      id: "land",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      paint: { "fill-color": "#8bd36b", "fill-antialias": false }
    },
    {
      id: "wood",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "wood"],
      paint: { "fill-color": "#4e9b59", "fill-antialias": false }
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: { "fill-color": "#73c9e8", "fill-antialias": false }
    },
    {
      id: "residential",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["==", ["get", "class"], "residential"],
      paint: { "fill-color": "#b7df8a", "fill-opacity": 0.8, "fill-antialias": false }
    },
    {
      id: "buildings",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 13,
      paint: { "fill-color": "#f4d49b", "fill-outline-color": "#9a673f", "fill-antialias": false }
    },
    {
      id: "roads-major",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      paint: { "line-color": "#fff1a8", "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 14, 5], "line-gap-width": 1 }
    },
    {
      id: "roads-minor",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      paint: { "line-color": "#fff8da", "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.6, 16, 3] }
    },
    {
      id: "boundaries",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      paint: { "line-color": "#477a69", "line-width": 1, "line-dasharray": [2, 2] }
    },
    {
      id: "places",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      layout: {
        "text-field": ["get", "name"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 4, 10, 12, 14],
        "text-font": ["Noto Sans Regular"]
      },
      paint: {
        "text-color": "#17333d",
        "text-halo-color": "#fffdf5",
        "text-halo-width": 2
      }
    }
  ]
};
