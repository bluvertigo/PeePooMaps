import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "PeePooMaps",
        short_name: "PeePooMaps",
        description: "Una mappa privata dei tuoi eventi quotidiani.",
        theme_color: "#173b45",
        background_color: "#f5f2eb",
        display: "standalone",
        icons: []
      }
    })
  ]
});
