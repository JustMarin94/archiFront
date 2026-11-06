import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
  },
  server: {
    allowedHosts: ["779c-2a05-4f44-30d-9100-1134-98f3-596-3bd1.ngrok-free.app"],
  },
});
