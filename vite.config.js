import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/memorial-project/" : "/",

  plugins: [vue()],

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "mixed-decls",
          "color-functions",
          "global-builtin",
          "import",
        ],
      },
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "recordatorio.cybernovatech.space",
      "api.cybernovatech.space"
    ],
    proxy: {
      "/api": {
        target: "http://192.168.0.99:3000",
        changeOrigin: true,
        secure: false
      }
    }
  }
}))