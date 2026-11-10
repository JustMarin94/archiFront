import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/i18n";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WorkDetails from "./pages/WorkDetails.jsx";
import AuthorsDetails from "./pages/AuthorsDetails.jsx";
import FilterPage from "./pages/FilterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx"; // 1. Import LoginPage
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // 2. Import ProtectedRoute

import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/filter", element: <FilterPage /> },
  { path: "/works/:id", element: <WorkDetails /> },
  { path: "/authors/:id", element: <AuthorsDetails /> },
  { path: "/login", element: <LoginPage /> }, // 3. Add login route
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  }, // 4. Secure admin route
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </QueryClientProvider>,
);
