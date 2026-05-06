import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/bug-tracker/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pdf-libs": ["jspdf", "html2canvas"],
        },
      },
    },
  },
});
