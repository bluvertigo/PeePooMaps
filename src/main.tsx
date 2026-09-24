import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./styles.css";

const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW: (_serviceWorkerUrl, registration) => {
    if (!registration) return;
    void registration.update();
    const refreshOnReturn = () => {
      if (document.visibilityState === "visible") void registration.update();
    };
    document.addEventListener("visibilitychange", refreshOnReturn);
    window.addEventListener("beforeunload", () => {
      document.removeEventListener("visibilitychange", refreshOnReturn);
    }, { once: true });
  },
  onNeedRefresh: () => {
    void updateServiceWorker(true);
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
