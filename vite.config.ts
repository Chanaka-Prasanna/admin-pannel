import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths"; // added this line

export default defineConfig({
  plugins: [tsconfigPaths(), react()], // added this tsconfigPaths()
});
