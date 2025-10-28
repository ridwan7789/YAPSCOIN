import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./serviceWorker";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker untuk caching offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}
