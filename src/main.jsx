import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WorkDetails from "./pages/WorkDetails.jsx";
import AuthorsDetails from "./pages/AuthorsDetails.jsx";
import FilterPage from "./pages/FilterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/filter", element: <FilterPage /> },
  {
    path: "/works/:id",
    element: <WorkDetails />,
  },
  {
    path: "/authors/:id",
    element: <AuthorsDetails />,
  },
  { path: "/admin", element: <AdminPage /> },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </QueryClientProvider>,
);
