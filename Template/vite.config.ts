import path from "path"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from "rollup-plugin-visualizer"

const devProxy = {
  "/eventflow/home": {
    target: "https://instance5.tier0.app:8443",
    changeOrigin: true,
    secure: true,
  },
}

const getOutDirName = (basePath: string) => {
  const cleanPath = basePath.replace(/^\/+|\/+$/g, "")
  if (!cleanPath) return "default"
  const parts = cleanPath.split("/").filter(Boolean)
  return parts.at(-1) || "default"
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const basePath = env.VITE_BASE_PATH || "/"
  const outDirName = mode === "preview" ? basePath : getOutDirName(basePath)
  const analyze = env.VITE_ANALYZE === "true"

  return {
    base: basePath,
    build: {
      outDir: `dist/${outDirName}`,
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-ui": [
              "@radix-ui/react-select",
              "@radix-ui/react-slot",
              "lucide-react",
              "sonner",
            ],
            "vendor-utils": ["clsx", "tailwind-merge", "dayjs"],
            "vendor-i18n": ["i18next", "react-i18next"],
          },
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      analyze &&
        visualizer({
          filename: `dist/${basePath}/stats.html`,
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        ...devProxy,
      },
    },
    preview: {
      proxy: {
        ...devProxy,
      },
    },
  }
})

