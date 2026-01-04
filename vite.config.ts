import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure base path for GitHub Pages
  // Set to '/repo-name/' if deploying to a subdirectory, otherwise '/'
  // Use environment variable to support both scenarios
  base: mode === "production" ? process.env.BASE_URL || "/" : "/",
  build: {
    // Ensure proper handling of client-side routing
    outDir: "dist",
    emptyOutDir: true,
  },
}));
