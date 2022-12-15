import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: { port: (process.env.SERVER_PORT as unknown as number) || 8000 },
  build: {
    target: "esnext",
  },
});
