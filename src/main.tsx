import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

// Redirect to splash on initial load
if (window.location.pathname === "/") {
  window.history.replaceState({}, "", "/splash");
}

root.render(<App />);
