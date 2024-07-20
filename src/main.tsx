import ReactDOM from "react-dom/client";

import "@/styles/index.css";
import { RouterProvider } from "react-router-dom";

import { pageRoutes } from "./config";
import { AuthProvider, ThemeProvider } from "./providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider storageKey="vite-ui-theme">
      <div className="min-h-dvh w-dvw">
        <RouterProvider router={pageRoutes} />
      </div>
    </ThemeProvider>
  </AuthProvider>
);
