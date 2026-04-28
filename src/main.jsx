import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

const isSettings = window.location.search.includes("settings");

const App = lazy(() =>
  isSettings
    ? import("./components/SettingsApp").then((m) => ({ default: m.default }))
    : import("./App.jsx").then((m) => ({ default: m.default })),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense
      fallback={<div style={{ background: "#080808", minHeight: "100vh" }} />}
    >
      <App />
    </Suspense>
  </StrictMode>,
);
