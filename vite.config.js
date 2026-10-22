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
    allowedHosts: [
      "637a-2a05-4f44-30d-9100-8183-7b2d-d5b5-14bc.ngrok-free.app",
    ],
  },
});
