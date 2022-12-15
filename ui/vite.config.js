import { defineConfig } from "vite";

export default defineConfig({
  server: { port: process.env.SERVER_PORT || 8000 },
});
