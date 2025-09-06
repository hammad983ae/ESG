import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createRequire } from "node:module";
import { normalizePath } from "vite";

// Resolve pdfjs-dist standard fonts path
const require = createRequire(import.meta.url);
const pdfjsStandardFontsPath = normalizePath(
  require.resolve("pdfjs-dist/standard_fonts")
);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    viteStaticCopy({
      targets: [
        {
          src: pdfjsStandardFontsPath,
          dest: "pdfjs-dist/standard_fonts"
        }
      ]
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs': ['pdfjs-dist']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
}));
