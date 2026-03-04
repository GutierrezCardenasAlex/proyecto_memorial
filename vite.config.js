// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: "/memorial-project/",
//   plugins: [vue()],
//   css: {
//     preprocessorOptions: {
//       scss: {
//         silenceDeprecations: [
// // "          "mixed-decls","
//           "color-functions",
//           "global-builtin",
//           "import",
//         ],
//       },
//     },
//   },
//   server: {
//     proxy: {
//       "/api": "http://localhost:3000",
//     },
//   },
// });

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
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  }
}))